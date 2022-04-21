import React from 'react';
import {withTranslation} from 'react-i18next';

import {View} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {Dimensions} from 'react-native';

import Filter from '../../../shared/filter/Filter';
import Field from '../../../shared/fields/field';
import MasterButton from '../../../shared/buttons/MasterButton';
import EditableTable from '../../../shared/table/EditableTable';

import {stockCountService} from '../../../../services/stockCountService';
import {notificationService} from '../../../../services/notificationService';
import {openMessageDialog} from '../../../../redux/message-dialog/MessageDialog.actions';
import {insert, deleteTrx_Type} from '../../../../services/database/CRUD';
import {filterList} from '../../../../services/database/Search';

import {
  onChangeInput,
  detectPortrait,
  parseDataFromFilter,
  swapItemFromSAP,
  convertObjToArray,
  isConnectedToTheNetwork,
  isInitialFilter,
  deepCopy,
} from '../../../../utils/functions';

import {
  columns,
  searchField as SearchField,
  filterField as FilterField,
} from './stock-count-recount-list.config';

import {
  PaginationConfiguration,
  buttonConstant,
  dialogConstant,
  STATUS,
  NotificationType,
} from '../../../../constants/constants';
import {MESSAGE} from '../../../../constants/message';
import {tableConstant} from '../../../../database/Constant';

import {stockRecountStyle} from './StockCountRecountList.style';

class StockCountRecountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterField: FilterField,
      searchField: SearchField(this.onSearch),
      pageSize: 10,
      list: [],
      loading: false,
      loadingMore: false,
      refreshing: false,
      isPortTrait: false,
      cellChanged: {
        idName: '',
        fieldName: '',
        idValue: '',
        selected: '',
      },
      page: PaginationConfiguration.currentPage,
      modalVisible: false,
      filterData: {},
      isOnline: true,
      isFilter: false,
      messageDialog: '',
    };
  }

  _isMounted = true;

  componentDidMount() {
    // [HONDAIPB-Update] - 23/06/2020 - Update refactor w reload after navigate
    // Replace handleReload callback with will focus event
    const {navigation} = this.props;
    // Handle fetch data if navigate focus this screen
    this.willFocusSubscription = navigation.addListener('willFocus', () => {
      const {filterData} = this.state;
      this.onFilter(filterData);
    });
    // [#HONDAIPB-FixBug] - 24/06/2020 - Filter can not refresh after navigate others screen
    // Call event to clear filter
    this.subscription = notificationService
      .onNotify()
      .subscribe(notification => {
        switch (notification.type) {
          case NotificationType.IS_CLEAR_FILTER:
            this.filterComponent && this.filterComponent.onClear();
            break;
          default:
            break;
        }
      });
    this.detectOrientation();
    Dimensions.addEventListener('change', data => {
      const {height, width} = data.window;
      this.detectOrientation(width, height);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.subscription.unsubscribe();
    this.willFocusSubscription.remove();
    Dimensions.removeEventListener('change', this.detectOrientation());
  }

  loadLazyItems = () => {
    const {page, totalItems, pageSize, list} = this.state;
    let startIndex = (page - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems.length - 1);
    const pageOfItems = totalItems.slice(startIndex, endIndex + 1);
    setTimeout(() => {
      this.setState((prevState, nextProps) => ({
        list: page === 1 ? Array.from(pageOfItems) : [...list, ...pageOfItems],
        loading: false,
        loadingMore: false,
      }));
    }, 0);
  };

  handleLoadMore = () => {
    const {totalItems, pageSize, page} = this.state;
    const isLastPage = page === Math.ceil(totalItems.length / pageSize);

    if (isLastPage) {
      return;
    }

    this.setState(
      (prevState, nextProps) => ({
        page: prevState.page + 1,
        loadingMore: true,
      }),
      () => {
        this.loadLazyItems();
      },
    );
  };

  detectOrientation = (screenWidth, screenHeight) => {
    let isPortrait = detectPortrait(screenWidth, screenHeight);
    if (this._isMounted) {
      this.setState({
        isPortTrait: isPortrait,
      });
    }
  };

  filterToggle = () => {
    this.setState({modalVisible: !this.state.modalVisible});
  };

  onSearch = () => {
    this.filterComponent && this.filterComponent.onClear();
    this.setState({
      loadingMore: true,
      list: [],
      page: PaginationConfiguration.currentPage,
    });
    let filterData = {
      Sap_Doc: this.state.searchField[0].value,
    };
    filterData = parseDataFromFilter(filterData);
    filterList(tableConstant.trx_type.STOCK_RECOUNT, filterData).then(data => {
      const totalItems = convertObjToArray(data);
      this.setState({totalItems}, () => {
        this.loadLazyItems();
      });
    });
  };

  handleReload = () => {
    const {filterData = {}} = this.state;
    this.onFilter(filterData);
  };

  onFilter = async filterData => {
    const isConnected = await isConnectedToTheNetwork();

    if (!isConnected) {
      this.callMessage(MESSAGE.M010);
      return;
    }

    this.setState({
      loadingMore: true,
      list: [],
      page: PaginationConfiguration.currentPage,
      modalVisible: false,
      filterData: filterData,
      isFilter: !isInitialFilter(filterData),
      // Clear search
      searchField: SearchField(this.onSearch),
    });

    if (this._isMounted) {
      stockCountService
        .filterStockCountRecount(filterData)
        .then(res => {
          const {results} = res.d;
          if (results) {
            this.deleteDBBeforeInsert(results);
          }
        })
        .catch(res => {
          if (res === STATUS.UN_AUTHEN || res === STATUS.USER_LOCKED) {
            this.props.navigation.navigate('Login');
            return;
          }
          this.setState({
            loadingMore: false,
            list: [],
            page: PaginationConfiguration.currentPage,
          });
        });
    }
  };

  onValueChange = e => {
    const newFields = onChangeInput(this.state.searchField, e);
    this.setState({searchField: newFields});
  };

  deleteDBBeforeInsert = async listItem => {
    // Binding data
    swapItemFromSAP(listItem);
    let newListItem = await deepCopy(listItem);
    // Call DB services
    deleteTrx_Type(
      tableConstant.name.MASTER,
      tableConstant.masterKey.C_RECOUNT,
      tableConstant.trx_type.STOCK_RECOUNT,
    )
      .then(() => {
        insert(tableConstant.name.MASTER, {
          id: tableConstant.masterKey.C_RECOUNT,
          Trx_Type: tableConstant.trx_type.STOCK_RECOUNT,
          Doc_Header: newListItem,
        })
          .then(data => {
            // Clone data from DB avoid accessing error
            let cloneHeaders = deepCopy(data),
              totalItems = convertObjToArray(cloneHeaders);
            this.setState({totalItems: totalItems}, () => {
              this.loadLazyItems();
            });
          })
          .catch(() => this.callMessage(MESSAGE.M017));
      })
      .catch(() => this.callMessage(MESSAGE.M017));
  };

  onClearFilter = filterData => {
    this.setState({isFilter: false, filterData});
  };

  closeFilterPopup = () => {
    this.setState({modalVisible: false});
  };

  callMessage = message => {
    const {t} = this.props;
    let messObj;
    switch (message) {
      case MESSAGE.M010:
        messObj = {
          content: t(message),
          buttons: [
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.FUNCTION,
              action: () => this.closeFilterPopup(),
            },
          ],
        };
        break;
      case MESSAGE.M017:
        messObj = {
          content: t(message),
          buttons: [
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.NONE_FUNCTION,
            },
          ],
        };
        break;
      default:
        messObj = {};
        break;
    }
    openMessageDialog(messObj);
  };

  render() {
    const {t} = this.props;
    const {
      list,
      refreshing,
      cellChanged,
      loadingMore,
      searchField,
      filterField,
      modalVisible,
      isPortTrait,
      isFilter,
    } = this.state;

    const {
      rowSearch,
      rowBtn,
      btnTitle,
      viewSearch,
      viewBtn,
      rowContainer,
      viewEditable,
      widthBtn,
      flexWidthBtn,
      flexRowBtn,
      rowPadding,
      viewMargin,
      flexRow,
      flexContainer,
      btnDefault,
      btnHightlight,
    } = stockRecountStyle;

    return (
      <Grid>
        <Row style={isPortTrait ? rowContainer : flexContainer}>
          <Col style={[viewSearch, isPortTrait ? '' : viewMargin]}>
            <View style={isPortTrait ? flexRow : viewBtn}>
              <Row style={[rowSearch, isPortTrait ? rowPadding : '']}>
                <Field
                  conditionalArray={searchField}
                  onChange={this.onValueChange}
                />
              </Row>
              <Row style={[isPortTrait ? rowBtn : flexRowBtn]}>
                <MasterButton
                  icon="md-sync"
                  title={t('Refresh')}
                  buttonStyle={[
                    isPortTrait ? flexWidthBtn : widthBtn,
                    btnDefault,
                  ]}
                  titleStyle={btnTitle}
                  handleClick={this.handleReload}
                />
                <MasterButton
                  icon="ios-funnel"
                  title={t('Filter')}
                  buttonStyle={[
                    isPortTrait ? flexWidthBtn : widthBtn,
                    isFilter ? btnHightlight : btnDefault,
                  ]}
                  handleClick={this.filterToggle}
                  titleStyle={btnTitle}
                />
              </Row>
            </View>
          </Col>
        </Row>
        <Row size={80}>
          <View style={[viewEditable]}>
            <EditableTable
              ref={ref => {
                this.table = ref;
              }}
              columns={columns}
              values={list}
              detailPath={'StockCountRecountDetail'}
              loadingMore={loadingMore}
              refreshing={refreshing}
              cellChanged={cellChanged}
              handleLoadMore={this.handleLoadMore}
              onSubmitEditing={this.onSubmitEditing}
              handleReload={this.handleReload}
            />
          </View>
        </Row>
        <Filter
          modalVisible={modalVisible}
          showDialog={this.filterToggle}
          fieldArray={filterField}
          isPortTrait={isPortTrait}
          onFilter={this.onFilter}
          ref={ref => {
            this.filterComponent = ref;
          }}
          onClearFilter={this.onClearFilter}
        />
      </Grid>
    );
  }
}

export default withTranslation()(StockCountRecountList);
