import React from 'react';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

import { View, Text, Image, SafeAreaView } from 'react-native';
import Filter from '../../shared/filter/Filter';
import { filterField as FilterField } from './goods-receipt-list.config';
import {
  getGoodsReceiptList,
  getGoodsReceiptDetailsById,
  deleteGoodsReceipt,
  cancelGoodsReceipt,
  getGRType,
  getGRStatus,
  getGRVendor,
} from '../../../actions/goods-receipt-action';
import ListForm from '../../shared/list-form/ListForm';
import { filterService } from '../../../services/filterService';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  setDateRangeRequestParams,
} from '../../shared/filter/filter-form.common';
import { noImage } from '../../../assets/images';

import { formatComboBox } from '../../../utils/format-util';
import {
  GRConstant,
  dateFormat,
  PaginationConfiguration,
  buttonConstant,
  dialogConstant,
  statusConst,
} from '../../../constants/constants';

import { formatDateString } from '../../../utils/date-util';
import TimeComponent from '../../shared/detail-form/TimeComponent';
import { MESSAGE } from '../../../constants/message';
import { openMessageDialog } from '../../../redux/message-dialog/MessageDialog.actions';
import { styles } from './GoodsReceiptList.style';

class GoodsReceiptList extends React.Component {
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
        .subtract(1, 'months')
        .format(dateFormat.yyyymmddStartDay),
      defaultEndDate: moment().format(dateFormat.yyyymmddEndDay),
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    // Handle logic when focus this screen
    this.willFocusSubscription = navigation.addListener('willFocus', () => {
      // Add filter listener
      this.subscription = filterService.onFilter().subscribe(isFilter => {
        if (isFilter) {
          this.filterToggle();
        }
      });

      // refresh when this screen is focused
      this.loadGRType();
      this.loadGRStatus();
      this.loadGRVendor();
      this.getGoodsReceipt(this.state.searchFieldsParam);
    });

    // Handle logic when leave focus this screen
    this.willLeaveFocusSubscription = navigation.addListener('willBlur', () => {
      this.subscription && this.subscription.unsubscribe();
      this.filterComponent && this.filterComponent.onClear();
      this.subscription = undefined;
      this.filterComponent = undefined;
    });
  }

  getGoodsReceipt = body => {
    // Get all Goods Receipt
    let params = body;
    if (isEmpty(params)) {
      params = {
        countFlag: PaginationConfiguration.countFlag,
      };
      params = setDateRangeRequestParams(
        params,
        {
          [GRConstant.searchFieldName.submittedDate]: {
            from: this.state.defaultStartDate,
            to: this.state.defaultEndDate,
          },
        },
        GRConstant.searchFieldName.submittedDate,
      );
      this.setState({ searchFieldsParam: params });
    }
    let newData = '';
    getGoodsReceiptList(params).then(res => {
      newData = res.data.map((item, index) => ({
        key: index,
        ...item,
        isDelete: item.sapExportedStatusName === statusConst.status.draft,
        isComplete: item.sapExportedStatusName === statusConst.status.completed,
        isCancelled: this.checkCancelItem(item),
        title: `GR No.:${item.receiptNumber || ''}`,
        status: item.sapExportedStatusName,
        stepLabel:
          item.sapExportedStatusName === statusConst.status.draft
          && (item.submittedTime2 && 'Step 2') ||
          (item.submittedTime1 && 'Step 1'),
        generalLabel: [
          { title: `Type:${item.goodReceiptTypeName || ''}` },
          { title: `Truck Temperature:${item.truckTemperature || ''}` },
          { title: `Created By:${item.createdBy || ''}` },
        ],
      }));
      this.setState({ totalItems: newData, list: [], page: PaginationConfiguration.currentPage }, () => {
        this.loadLazyItems();
      });
    });
  };

  componentWillUnmount() {
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
    let isCancelled = false;
    const isComplete =
      item.sapExportedStatusName === statusConst.status.completed;
    const isBranchPO = item.goodReceiptTypeName === GRConstant.branchPO;
    const itemMonth = formatDateString(item.submittedTime, 'MM', true);
    let currentMonth = new Date().getMonth() + 1;
    if (currentMonth < 10) {
      currentMonth = '0' + currentMonth;
    }
    const validMonth = +itemMonth === +currentMonth;
    if (isComplete && isBranchPO && validMonth) {
      isCancelled = true;
    }
    return isCancelled;
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

  loadGRType = param => {
    getGRType(param).then(res =>
      this.updateFieldArrayState(
        GRConstant.searchFieldName.type,
        'data',
        formatComboBox(res.data),
      ),
    );
  };

  loadGRStatus = () => {
    getGRStatus().then(res =>
      this.updateFieldArrayState(
        GRConstant.searchFieldName.status,
        'data',
        formatComboBox(res.data),
      ),
    );
  };

  loadGRVendor = param => {
    getGRVendor(param).then(res =>
      this.updateFieldArrayState(
        GRConstant.searchFieldName.vendor,
        'data',
        formatComboBox(res.data),
      ),
    );
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
    this.getGoodsReceipt(inputParams);
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
      GRConstant.searchFieldName.refNumber,
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.refNo,
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.type,
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.createdBy,
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.submittedDate,
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.status,
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.deliveryNote,
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.vendor,
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.materialDescription,
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.batchNo,
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.materialDocument,
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.poStoNumber,
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

  handleGetTime = (time, remainingTime, data) => {
    this.props.navigation.navigate('GoodsReceiptAddEdit', {
      detailsInfo: { ...data.item, remainingTime: remainingTime },
    });
  };

  handleViewDetailsItem = data => {
    const { dataDetail } = this.state;
    if (this.isViewDetailWithStatus(data)) {
      this.props.navigation.navigate('GoodsReceiptDetailScreen', {
        goodsReceiptNo: data.item.receiptNumber,
        detailsInfo: data.item,
        detailsItemsData: dataDetail,
      });
    } else {
      if (!!data.item.remainingTime) {
        this[`ref${data.index}`].getTime(data);
      } else {
        this.props.navigation.navigate('GoodsReceiptAddEdit', {
          detailsInfo: data.item,
        });
      }
    }
  };


  updatedData = (data, status) => {
    const { searchFieldsParam } = this.state;
    const grNo = data.item.receiptNumber;
    const isCancelled = status === statusConst.status.cancelled;
    const messageContent = isCancelled
      ? MESSAGE.GR.CANCEL_CONFIRM_INSTANCE
      : MESSAGE.GR.DELETE_CONFIRM_INSTANCE;
    const messageSuccess = isCancelled
      ? MESSAGE.GR.CANCELLED_GR_SUCCESSFULLY
      : MESSAGE.GR.DELETED_GR_SUCCESSFULLY;
    let messObj = {
      content: messageContent.replace('%INSTANCE%', `Goods Receipt:${grNo}`),
      buttons: [
        {
          name: buttonConstant.BUTTON_CANCEL,
          type: dialogConstant.button.NONE_FUNCTION,
        },
        {
          name: buttonConstant.BUTTON_OK,
          type: dialogConstant.button.FUNCTION,
          action: async () => {
            const actionType = isCancelled
              ? cancelGoodsReceipt({ receiptNumber: grNo })
              : deleteGoodsReceipt({ receiptNumber: grNo });
            await actionType.then(() => {
              openMessageDialog({
                content: messageSuccess.replace(
                  '%grNo%',
                  `Goods Receipt:${grNo}`,
                ),
                buttons: [
                  {
                    name: buttonConstant.BUTTON_OK,
                    type: dialogConstant.button.FUNCTION,
                    action: () => {
                      this.setState(
                        { list: [], page: PaginationConfiguration.currentPage },
                        () => {
                          this.getGoodsReceipt(searchFieldsParam);
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
  handleCancel = data => {
    this.updatedData(data, statusConst.status.cancelled);
  };
  handleDelete = data => {
    this.updatedData(data, statusConst.status.deleted);
  };
  handleDetailItem = data => {
    const grId = data.item.goodsReceiptId;
    getGoodsReceiptDetailsById({
      id: grId,
    }).then(res => {
      this.setState(() => ({
        dataDetail: res.data.goodsReceiptItems,
      }));
    });
  };

  renderChildrenItem = () => {
    const { dataDetail } = this.state;

    if (dataDetail && dataDetail.length) {
      return [...dataDetail].map((item, index) => {
        return (
          <View style={styles.viewItem} key={index}>
            <View style={styles.viewItemInfo}>
              <Image style={styles.image} source={noImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.textFont}>Code:{item.sku}</Text>
                <Text style={[styles.textFont, styles.description]}>
                  {item.description}
                </Text>
                <Text style={styles.textFont}>Order Unit:{item.uom}</Text>
                <Text style={styles.textFont}>
                  {item.materialGroup}
                </Text>
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
    }
  };

  renderRemainingTime = (item, key) => {
    return (
      <TimeComponent
        configTime={{
          minute: item.substring(10, 12),
          second: item.substring(12, 14),
        }}
        showRemainingTime={true}
        ref={input => {
          this[`ref${key}`] = input;
        }}
        handleGetTime={this.handleGetTime}
      />
    );
  };

  render() {
    const { modalVisible, filterField, list, loadingMore } = this.state;

    return (
      <SafeAreaView>
        <ListForm
          listData={list}
          handleLoadMore={this.handleLoadMore}
          loadingMore={loadingMore}
          handleDelete={this.handleDelete}
          handleCancel={this.handleCancel}
          handleDetailItem={this.handleDetailItem}
          renderChildrenItem={this.renderChildrenItem}
          handleClickOnItems={this.handleViewDetailsItem}
          handleGetTime={this.handleGetTime}
          renderRemainingTime={this.renderRemainingTime}
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

export default GoodsReceiptList;
