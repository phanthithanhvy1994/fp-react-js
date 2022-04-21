import React from 'react';
import {View, Text, Image, SafeAreaView} from 'react-native';
import ListForm from '../../shared/list-form/ListForm';
import Filter from '../../shared/filter/Filter';
import {styles} from './AssetReceiptList.style';
import {noImage} from '../../../assets/images';
import {filterField as FilterField} from './AssetReceiptList.config';
import {openMessageDialog} from '../../../redux/message-dialog/MessageDialog.actions';
import {MESSAGE} from '../../../constants/message';
import {filterService} from '../../../services/filterService';
import {
  PaginationConfiguration,
  statusConst,
  buttonConstant,
  dialogConstant,
} from '../../../constants/constants';
import {
  getAssetReceiptList,
  getAssetReceiptDetailById,
} from '../../../actions/asset-receipt-action';

class AssetReceiptList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      filterField: [...FilterField],
      page: PaginationConfiguration.currentPage,
      totalItems: [],
      pageSize: PaginationConfiguration.itemsPerPage,
      list: [],
      modalVisible: false,
      dataDetail: [],
      loadingMore: false,
    };
  }

  componentDidMount = () => {
    const {navigation} = this.props;

    // Handle logic when focus this screen
    this.willFocusSubscription = navigation.addListener('willFocus', () => {
      this.subscription = filterService.onFilter().subscribe(isFilter => {
        if (isFilter) {
          this.filterToggle();
        }
      });
    });
    // Handle logic when leave focus this screen
    this.willLeaveFocusSubscription = navigation.addListener('willBlur', () => {
      this.subscription && this.subscription.unsubscribe();
      this.filterComponent && this.filterComponent.onClear();
    });

    this.getAssetReceiptList();
  };

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  updateFieldArrayState = (
    fieldName,
    updatedPropertyName,
    updatedData,
    defaultValue = null,
  ) => {
    if (updatedData) {
      const updateFieldArray = this.state.filterField;
      const fieldIndex = this.state.filterField.findIndex(
        el => el.fieldName === fieldName,
      );
      const field = fieldIndex !== -1 && this.state.filterField[fieldIndex];

      if (field) {
        field[updatedPropertyName] = updatedData;
        updateFieldArray[fieldIndex] = field;
        // Set default value if any
        if (defaultValue) {
          const defaultVal = updatedData.find(
            el => el.value === defaultValue.value,
          );
          updateFieldArray[fieldIndex].data =
            (defaultValue.isArray && defaultVal) || defaultVal;
        }
        this.setState({filterField: [...updateFieldArray]});
      }
    }
  };

  /**
   * Send request get list Asset Receipt
   * @param {*} param
   */
  getAssetReceiptList = param => {
    getAssetReceiptList().then(res => {
      const newData =
        (res?.data &&
          res.data.map((item, index) => ({
            key: index,
            ...item,
            isDelete: item.sapExportedStatusName === statusConst.status.draft,
            status: item.sapExportedStatusName,
            title: `AR No.:${item.arNo || ''}`,
            generalLabel: [
              {title: `AT No.: ${item.atNo || ''}`},
              {title: `From: ${item.from || ''}`},
              {title: `Created By: ${item.createdBy || ''}`},
            ],
            customClassItem: styles.rowAsset,
          }))) ||
        [];
      this.setState({totalItems: newData, list: []}, () => {
        this.loadLazyItems();
      });
    });
  };

  filterToggle = () => {
    this.setState({modalVisible: !this.state.modalVisible});
  };

  onFilter = filterData => {
    // // Get data input search area
  };

  onClearFilter = filterData => {
    this.setState({isFilter: false, filterData});
  };

  /**
   * Load data base on page
   */
  loadLazyItems = () => {
    const {page, totalItems, pageSize, list} = this.state;
    let startIndex = (page - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems.length - 1);
    const pageOfItems = totalItems.slice(startIndex, endIndex + 1);

    setTimeout(() => {
      this.setState((prevState, nextProps) => ({
        list:
          page === PaginationConfiguration.currentPage
            ? Array.from(pageOfItems)
            : [...list, ...pageOfItems],
        loadingMore: false,
      }));
    }, 0);
  };

  /**
   * Handle load more items
   * @returns
   */
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

  isViewDetailWithStatus = data => {
    const dataItem = data.item;
    const status = dataItem.status;

    return status !== statusConst.status.draft;
  };

  /**
   * Handle load detail item when click dropdown list
   * @param {*} data
   */
  handleDetailItem = data => {
    const astId = data.item?.assetReceiptId || '';

    getAssetReceiptDetailById({
      id: astId,
    }).then(res => {
      this.setState(() => ({
        dataDetail: (res.data && res.data?.assetReceiptItemsList) || [],
      }));
    });
  };

  /**
   * Go to detail or edit when double touch in item base on status
   */
   handleViewDetailsItem = data => {
    const { dataDetail } = this.state;
   
    if (this.isViewDetailWithStatus(data)) {
      this.props.navigation.navigate('AssetReceiptDetailScreen', {
        assetReceiptId: data.item.assetReceiptId,
        detailsInfo: data.item,
        detailsItemsData: dataDetail,
      });
    }
  };

  updatedData = (data, status) => {
    const arNo = data.item.assetReceiptId;
    const isDelete = status === statusConst.status.deleted;
    const messageContent = MESSAGE.ASSET_RECEIVING.DELETE_CONFIRM_INSTANCE
    const messageSuccess = MESSAGE.ASSET_RECEIVING.DELETED_AR_SUCCESSFULLY
    let messObj = {
      content: messageContent.replace('%INSTANCE%', `Asset Receipt:${arNo}`),
      buttons: [
        {
          name: buttonConstant.BUTTON_CANCEL,
          type: dialogConstant.button.NONE_FUNCTION,
        },
        {
          name: buttonConstant.BUTTON_OK,
          type: dialogConstant.button.FUNCTION,
          action: async () => {
            const actionType = !isDelete
              ? console.log('cancel')
              : console.log({ receiptNumber: arNo });
            await actionType.then(() => {
              openMessageDialog({
                content: messageSuccess.replace(
                  '%arNo%',
                  arNo,
                ),
                buttons: [
                  {
                    name: buttonConstant.BUTTON_OK,
                    type: dialogConstant.button.FUNCTION,
                    action: () => {
                      this.setState(
                        { list: [], page: PaginationConfiguration.currentPage },
                        () => {
                          this.getAssetReceiptList();
                        },
                      );
                    },
                  },
                ],
              });
            });
          },
        },
      ],
    };
    openMessageDialog(messObj);
  };

  handleDelete = data => {
    this.updatedData(data, statusConst.status.deleted);
  };

  /**
   * Render child items when click expand button
   * @returns
   */
  renderChildrenItem = () => {
    const {dataDetail} = this.state;
    return dataDetail
      ? [...dataDetail].map((item, index) => {
          return (
            <View style={styles.viewItem} key={index}>
              <View style={styles.viewItemInfo}>
                <Image style={styles.image} source={noImage} />
                <View>
                  <Text style={styles.textFont}>
                    Asset Code: {item.assetCode}
                  </Text>
                  <Text style={styles.textFont}>{item.description}</Text>
                  <Text style={styles.textFont}>Unit: {item.unit}</Text>
                  <Text style={styles.textFont}>
                    Asset Type: {item.assetType}
                  </Text>
                  <Text style={styles.textFont}>Catalog: {item.catalog}</Text>
                </View>
                <View style={styles.viewQty}>
                  <Text style={[styles.textFont, styles.textTitle]}>
                    {item.quantity ?? 2}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      : null;
  };

  render() {
    const {list, loadingMore, modalVisible, filterField} = this.state;

    return (
      <SafeAreaView>
        <ListForm
          listData={list}
          handleLoadMore={this.handleLoadMore}
          loadingMore={loadingMore}
          handleDetailItem={this.handleDetailItem}
          handleDelete={this.handleDelete}
          renderChildrenItem={this.renderChildrenItem}
          handleClickOnItems={this.handleViewDetailsItem}
          disabledSwipeRight={true}
        />
        <Filter
          modalVisible={modalVisible}
          showDialog={this.filterToggle}
          fieldArray={filterField}
          onFilter={this.onFilter}
          ref={ref => {
            this.filterComponent = ref;
          }}
          onClearFilter={this.onClearFilter}
        />
      </SafeAreaView>
    );
  }
}

export default AssetReceiptList;
