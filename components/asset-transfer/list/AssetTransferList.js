import React from 'react';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

import { View, Text, Image, SafeAreaView } from 'react-native';
import Filter from '../../shared/filter/Filter';
import { filterField as FilterField } from './AssetTransferList.config';
import {
  getAssetTransferList,
  getAssetTransferDetailsById,
  getASTType,
  loadAssetTransferStatus,
  deleteAssetTransfer,
  cancelAssetTransfer,
} from '../../../actions/asset-transfer-action';
import { getAssetLocation } from '../../../actions/common-action';
import ListForm from '../../shared/list-form/ListForm';
import { filterService } from '../../../services/filterService';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  setDateRangeRequestParams,
} from '../../shared/filter/filter-form.common';
import { noImage } from '../../../assets/images';

import { formatDropdownList, formatComboBox } from '../../../utils/format-util';
import { showMessage, getErrorMessage } from '../../../utils/message-util';
import {
  ATConstant,
  dateFormat,
  PaginationConfiguration,
  buttonConstant,
  dialogConstant,
  statusConst,
} from '../../../constants/constants';

import { formatDateString } from '../../../utils/date-util';

import { MESSAGE } from '../../../constants/message';
import { openMessageDialog } from '../../../redux/message-dialog/MessageDialog.actions';
import { styles } from './AssetTransferList.style';

class AssetTransferList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: PaginationConfiguration.currentPage,
      totalItems: [],
      pageSize: PaginationConfiguration.itemsPerPage,
      list: [],
      dataDetail: [],
      searchFieldsParam: {},
      loadingMore: false,
      filterField: [...FilterField],
      modalVisible: false,
      defaultStartDate: moment()
        .clone().startOf('month')
        .format(dateFormat.yyyymmddStartDay),
      defaultEndDate: moment().format(dateFormat.yyyymmddEndDay),
    };
  }

  _isMounted = true;

  componentDidMount() {
    const { navigation } = this.props;

    // Handle logic when focus this screen
    this.willFocusSubscription = navigation.addListener('willFocus', () => {
      this.subscription = filterService.onFilter().subscribe(isFilter => {
        if (isFilter) {
          this.filterToggle();
        }
      });

      // refresh when this screen is focused
      this.loadAssetTransferType();
      this.loadAssetTransferStatus();
      // load data for branchFrom and branchTo combobox
      this.loadAssetTransferLocation();
      this.getAssetTranfer(this.state.searchFieldsParam);
    });

    // Handle logic when leave focus this screen
    this.willLeaveFocusSubscription = navigation.addListener('willBlur', () => {
      this.subscription && this.subscription.unsubscribe();
      this.filterComponent && this.filterComponent.onClear();
      this.subscription = undefined;
      this.filterComponent = undefined;
    });
  }

  loadAssetTransferType = () => {
    this._isMounted && getASTType().then(res =>
      this.updateFieldArrayState(
        ATConstant.searchFieldName.assetTransferType,
        'data',
        formatComboBox(res.data),
      ),
    ).catch(() => {
      this.updateFieldArrayState(
        ATConstant.searchFieldName.assetTransferType,
        'data',
        [],
      )
    });
  };

  loadAssetTransferStatus = () => {
    this._isMounted && loadAssetTransferStatus().then(res =>
      this.updateFieldArrayState(
        ATConstant.searchFieldName.assetTransferStatus,
        'data',
        formatComboBox(res.data),
      ),
    ).catch(() => {
      this.updateFieldArrayState(
        ATConstant.searchFieldName.assetTransferStatus,
        'data',
        [],
      )
    });
  };

  loadAssetTransferLocation = () => {
    this._isMounted && getAssetLocation({
      // will be replace when have user plant
      // plant: '1000'
    }).then(res => {
      if (getErrorMessage(res)) {
        showMessage(getErrorMessage(res));
        return;
      }
      this.updateFieldArrayState(
        ATConstant.searchFieldName.branchFrom,
        'data',
        formatDropdownList(res.data, 'assetLocationCode', 'assetLocationName'),
      );
      this.updateFieldArrayState(
        ATConstant.searchFieldName.branchTo,
        'data',
        formatDropdownList(res.data, 'assetLocationCode', 'assetLocationName'),
      );
    }).catch(() => {
      this.updateFieldArrayState(
        ATConstant.searchFieldName.branchFrom,
        'data',
        [],
      );
      this.updateFieldArrayState(
        ATConstant.searchFieldName.branchTo,
        'data',
        [],
      );
    });
  }

  getAssetTranfer = body => {
    // Get all Asset Transfer
    let params = body;
    if (isEmpty(params)) {
      params = {
        countFlag: PaginationConfiguration.countFlag,
        deleteFlag: 0,
      };
      params = setDateRangeRequestParams(
        params,
        {
          [ATConstant.searchFieldName.createdDate]: {
            from: this.state.defaultStartDate,
            to: this.state.defaultEndDate,
          },
        },
        ATConstant.searchFieldName.createdDate,
      );
      this.setState({ searchFieldsParam: params });
    }
    let newData = [];
    this._isMounted && getAssetTransferList(params).then(res => {
      newData = res.data.map((item, index) => ({
        key: index,
        ...item,
        isDelete: item.statusName === statusConst.status.draft,
        isCancelled: this.checkCancelItem(item),
        title: `AT No.: ${item.assetTransferNo || ''}`,
        status: item.statusName,
        generalLabel: [
          { title: `Type: ${item.assetTransferTypeName || ''}` },
          { title: `From: ${item.branchNameFrom || ''}` },
          { title: `To: ${item.branchNameTo || ''}` },
        ],
      }));
      this.setState({ totalItems: newData, list: [], page: PaginationConfiguration.currentPage }, () => {
        this.loadLazyItems();
      });
    }).catch((err) => {
      const msg = getErrorMessage(err);
      showMessage(msg);
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.subscription && this.subscription.unsubscribe();
    this.filterComponent && this.filterComponent.onClear();
    this.subscription = undefined;
    this.filterComponent = undefined;
  }

  isViewDetailWithStatus = data => {
    const dataItem = data.item;
    const status = dataItem.status;

    return status !== statusConst.status.draft;
  };

  checkCancelItem = item => {
    return item.statusName === statusConst.status.submitted;
  };

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
        this.setState({ filterField: [...updateFieldArray] });
      }
    }
  };

  filterToggle = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  onFilter = filterData => {
    // Get data input search area
    const inputParams = this.getSearchParams(filterData);
    this.setState({
      searchFieldsParam: inputParams,
      loadingMore: true,
      list: [],
      page: PaginationConfiguration.currentPage,
    });
    this.getAssetTranfer(inputParams);
    this.filterToggle();
  };

  /**
   * Set request params and only push the property which has value into request params
   * @param {Object} fieldArr search fields on search form
   */
  getSearchParams = fieldArr => {
    let params = {
      deleteFlag: 0,
    };
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      ATConstant.searchFieldName.assetTransferNo,
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      ATConstant.searchFieldName.assetRequestNo,
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      ATConstant.searchFieldName.assetTransferType,
    );

    params = setDateRangeRequestParams(
      params,
      fieldArr,
      ATConstant.searchFieldName.createdDate,
    );

    params = setDateRangeRequestParams(
      params,
      fieldArr,
      ATConstant.searchFieldName.submittedDate,
    );

    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      ATConstant.searchFieldName.assetTransferStatus,
      'status',
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      ATConstant.searchFieldName.sSDNo,
      'ssdNo',
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      ATConstant.searchFieldName.branchFrom,
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      ATConstant.searchFieldName.branchTo,
    );
    return params;
  };

  onClearFilter = filterData => {
    this.setState({ isFilter: false, filterData });
  };

  loadLazyItems = () => {
    const { page, totalItems, pageSize, list } = this.state;
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
    const { totalItems, pageSize, page } = this.state;
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

  handleViewDetailsItem = data => {
    const { dataDetail } = this.state;

    if (this.isViewDetailWithStatus(data)) {
      this.props.navigation.navigate('AssetTransferDetailScreen', {
        assetTransferId: data.item.assetTransferId,
        assetTransferNo: data.item.assetTransferNo,
        detailsInfo: data.item,
        detailsItemsData: dataDetail,
      });
    } else {
      // go to edit page
      this.props.navigation.navigate('AssetTransferAddEdit', {
        assetTransferNoString: data.item.assetTransferNo,
        assetTransferNo: data.item.assetTransferId,
        isEditPage: true
      });
    }
  };

  reloadDataList = () => {
    const { searchFieldsParam } = this.state;

    this.setState(
      { list: [], page: PaginationConfiguration.currentPage },
      () => {
        this.getAssetTranfer(searchFieldsParam);
      },
    );
  };

  confirmDelete = (data) => {
    const assetTransferNo = data.item.assetTransferNo;
    const assetTransferId = data.item.assetTransferId;
    showMessage(
      MESSAGE.AST.CONFIRM_DELETE_AS_TRANSFER.replace('{{astNo}}', assetTransferNo),
      this.handleDelete.bind(this, assetTransferNo, assetTransferId),
      true,
    );
  };

  handleDelete = (assetTransferNo, assetTransferId) => {
    deleteAssetTransfer(assetTransferId).then((res) => {
      if (res.message) {
        showMessage(getErrorMessage(res));
        return;
      } else {
        showMessage(
          MESSAGE.AST.DELETE_ASSET_TRANSFER_SUCCESSFULLY.replace('{{astNo}}', assetTransferNo),
          this.reloadDataList.bind(this)
        );
      }
    }).catch((err) => {
      if (typeof err === 'string') {
        showMessage(err);
        return;
      }

      const msg = getErrorMessage(err);
      showMessage(msg);
    });
  };

  confirmCancel = (data) => {
    const assetTransferNo = data.item.assetTransferNo;
    const assetTransferId = data.item.assetTransferId;
    showMessage(
      MESSAGE.AST.CONFIRM_CANCEL_AS_TRANSFER.replace('{{astNo}}', assetTransferNo, assetTransferId),
      this.handleCancel.bind(this, assetTransferNo, assetTransferId),
      true,
    );
  };

  handleCancel = (assetTransferNo, assetTransferId) => {
    cancelAssetTransfer(assetTransferId).then((res) => {
      if (res.message) {
        showMessage(getErrorMessage(res));
      } else {
        showMessage(
          MESSAGE.AST.CANCEL_ASSET_TRANSFER_SUCCESSFULLY.replace('{{astNo}}', assetTransferNo),
          this.reloadDataList.bind(this)
        );
      }
    }).catch((err) => {
      if (typeof err === 'string') {
        showMessage(err);
        return;
      }

      const msg = getErrorMessage(err);
      showMessage(msg);
    });
  };

  convertDataForItems = res => {
    let detailItems = [];
    const assetTransferDetailTbls = res.data && res.data.assetTransferDetailTbls;
    if (assetTransferDetailTbls && assetTransferDetailTbls.length) {
      assetTransferDetailTbls.map((item) => {
        if (item.assetTransferRequestDetailVOS) {
          detailItems = [...detailItems, ...item.assetTransferRequestDetailVOS]
        }
      })
    }

    return detailItems;
  }

  handleDetailItem = data => {
    const grId = data.item.assetTransferId;
    getAssetTransferDetailsById(grId).then(res => {
      const convertedDetailItems = this.convertDataForItems(res);
      this.setState({
        dataDetail: convertedDetailItems,
      });
    }).catch((err) => {
      const msg = getErrorMessage(err);
      showMessage(msg);
    });
  };

  renderChildrenItem = () => {
    const { dataDetail } = this.state;
    return dataDetail
      ? [...dataDetail].map((item, index) => {
        return (
          <View style={styles.viewItem} key={index}>
            <View style={styles.viewItemInfo}>
              <Image style={styles.image} source={noImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.textFont}>Asset Code:{item.assetNo}</Text>
                <Text style={[styles.textFont, styles.description]}>
                  {item.description}
                </Text>
                <Text style={styles.textFont}>{item.quantity}{' '}{item.baseUom}</Text>
              </View>

              <View style={styles.viewQty}>
                <Text style={[styles.textFont, styles.textTitle]}>
                  {item.quantity}
                </Text>
              </View>
            </View>
          </View>
        );
      })
      : null;
  };

  render() {
    const { modalVisible, filterField, list, loadingMore } = this.state;

    return (
      <SafeAreaView>
        <ListForm
          listData={list}
          handleLoadMore={this.handleLoadMore}
          loadingMore={loadingMore}
          handleDelete={this.confirmDelete}
          handleCancel={this.confirmCancel}
          handleDetailItem={this.handleDetailItem}
          renderChildrenItem={this.renderChildrenItem}
          handleClickOnItems={this.handleViewDetailsItem}
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

export default AssetTransferList;
