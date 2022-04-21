import React from 'react';
import { View, Text, Image, SafeAreaView } from 'react-native';
import Field from '../../shared/fields/field';
import ListForm from '../../shared/list-form/ListForm';
import DatePicker from '../../shared/fields/DatePicker';
import { styles } from './AssetTransferTrackingList.style';
import { noImage } from '../../../assets/images';
import { searchField } from './AssetTransferTrackingList.config';
import { calendarService } from '../../../services/calendarService';
import { openMessageDialog } from '../../../redux/message-dialog/MessageDialog.actions';
import { MESSAGE } from '../../../constants/message';
import { 
  formatDateString,
  convertToDateString 
} from '../../../utils/date-util';
import { 
  getAssetTrackingList, 
  deleteAssetTracking ,
  getAssetTrackingDetail
} from '../../../actions/asset-transfer-tracking-action';
import { 
  dateFormat,
  PaginationConfiguration,
  statusConst,
  ATTrackingConstant,
  buttonConstant,
  dialogConstant
} from '../../../constants/constants';

class AssetTransferTrackingList extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        selectedDate: new Date(),
        fields: [...searchField],
        page: PaginationConfiguration.currentPage,
        totalItems: [],
        pageSize: PaginationConfiguration.itemsPerPage,
        list: [],
        dataDetail: [],
        loadingMore: false,
      }
  };

  componentDidMount = () => {
    const { navigation } = this.props;

    // Handle logic when focus this screen
    this.willFocusSubscription = navigation.addListener('willFocus', () => {
      this.subscription = calendarService.onCalendar().subscribe(showCalendar => {
        if (showCalendar) {
          this.showCalendarPopup(true);
        }
      });
      this.getAssetTransferTracking();
    });
    // Handle logic when leave focus this screen
    this.willLeaveFocusSubscription = navigation.addListener('willBlur', () => {
      this.showCalendarPopup(false);
      this.subscription && this.subscription.unsubscribe();
    });
  };

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  };

  /**
   * Handle open/close date picker
   */
  showCalendarPopup = (isShow) => {
    if (this.calendarComponent) {
      isShow ? this.calendarComponent.showDatepicker() : this.calendarComponent.closeDatePicker();
    };
  };

  /**
   * Format body send request
   * @param {*} param 
   * @returns 
   */
  getBodyRequest = (param) => {
    const requestBody = {
      createdDateFrom: {
        ge: formatDateString(param || new Date(), dateFormat.savingDateTimeStartDate)
      },
      createdDateTo: {
        le: formatDateString(param || new Date(), dateFormat.savingDateTimeEndDate)
      },
    }

    return requestBody;
  }

  /**
   * Send request get list Asset Transfer Tracking
   * @param {*} param 
   */
  getAssetTransferTracking = (param) => {
    const requestBody = this.getBodyRequest(param);

    getAssetTrackingList(requestBody).then(
      (res) => {
        const newData = res?.data && res.data.map((item, index) => ({
          key: index,
          ...item,
          isDelete: (item.status === statusConst.statusCode.draft),
          title: `Tracking No.: ${item.assetTrackingNo || ''}`,
          status: item.statusName,
          generalLabel: [
            { title: `Created By: ${item.createdBy || ''}` },
            { title: `Created Date: ${convertToDateString(item.createdDate, dateFormat.ddmmyyyy) || ''}` },
          ],
          customClassItem: styles.rowAsset
        })) || [];
        this.setState({
          totalItems: newData,
          list: [],
          page: PaginationConfiguration.currentPage
        }, () => {
          this.loadLazyItems();
        });
      }
    );
  };

  /**
   * Load data base on page
   */
  loadLazyItems = () => {
    const { page, totalItems, pageSize, list } = this.state;
    let startIndex = (page - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems.length - 1);
    const pageOfItems = totalItems.slice(startIndex, endIndex + 1);

    setTimeout(() => {
      this.setState((prevState, nextProps) => ({
        list: page === PaginationConfiguration.currentPage ? Array.from(pageOfItems) : [...list, ...pageOfItems],
        loadingMore: false,
      }));
    }, 0);
  };

  /**
   * Handle load more items
   * @returns 
   */
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

  /**
   * Handle change value Asset Transfer No
   * @param {*} e 
   */
  onChangeField = (e) => {
    const newFields = [...this.state.fields];

    newFields[0].value = e?.target?.value || '';
    this.setState({
      fields: newFields
    });
  };

  /**
   * Render label date select
   * @returns Text
   */
  renderDate = () => {
    const {selectedDate} = this.state;
    const dateString = formatDateString(selectedDate, dateFormat.ddmmyyyy);

    return (
    <Text style={styles.dateSelected}>
      {dateString} {dateString === formatDateString(new Date(), dateFormat.ddmmyyyy) ? '(Today)' : ''}
    </Text>);
  };

  /**
   * Handle delete item
   * @param {*} data 
   */
  handleDelete = (data) => {
    const { selectedDate } = this.state;
    const msgConfirm = MESSAGE.ASSET_TRANSFER_TRACKING.DELETE_CONFIRM_INSTANCE;
    const msgSuccess = MESSAGE.ASSET_TRANSFER_TRACKING.DELETED_ASSET_SUCCESSFULLY;
    const assetTrackingNo = data?.item && data.item?.assetTrackingNo || '';
    const assetTrackingId = data?.item && data.item?.assetTrackingId || '';

    openMessageDialog({
      content: msgConfirm.replace('%INSTANCE%', assetTrackingNo),
      buttons: [
        {
          name: buttonConstant.BUTTON_CANCEL,
          type: dialogConstant.button.NONE_FUNCTION,
        },
        {
          name: buttonConstant.BUTTON_OK,
          type: dialogConstant.button.FUNCTION,
          action: () => {
            deleteAssetTracking({assetTrackingId}).then(
              () => {
                openMessageDialog({
                  content: msgSuccess.replace('%INSTANCE%', assetTrackingNo),
                  buttons: [
                    {
                      name: buttonConstant.BUTTON_OK,
                      type: dialogConstant.button.FUNCTION,
                      action: () => {
                        this.getAssetTransferTracking(selectedDate);
                      },
                    },
                  ],
                });
              }
            )
          }
        }
      ]
    });
  };

  convertDataDetails = (data) => {
    const dataResult = [];

    data?.assetTrackingDetailVOs?.map(
      (item) => {
        item?.assetTrackingTranferDetailVOs?.map(
          (itemChild) => dataResult.push(itemChild)
        )
      }
    );

    return dataResult || [];
  }

  /**
   * Handle load detail item when click dropdown list
   * @param {*} data 
   */
  handleDetailItem = data => {
    const astId = data.item?.assetTrackingId || '';

    getAssetTrackingDetail({
      id: astId,
    }).then(res => {
      this.setState(() => ({
        dataDetail: this.convertDataDetails(res.data),
      }));
    });
  };

  /**
   * Go to detail or edit when double touch in item base on status
   */
  handleViewDetailsItem = (data) => {
    // If status record is Draft, go to Edit Asset Transfer Tracking
    // else, if status is Confirmed or Partially Confirmed, go to details
    if (data?.item?.status === statusConst.status.draft) {
      this.props.navigation.navigate('AssetTransferTrackingAddEdit', {
        assetTrackingId: data.item?.assetTrackingId,
        isEditPage: true
      });
    } else {
      this.props.navigation.navigate('AssetTransferTrackingDetails', {
        assetTrackingId: data.item?.assetTrackingId,
      });
    }
  };

  /**
   * Handle selected date when open date picker
   * @param {*} selectedDate 
   */
  onChangeDate = (selectedDate) => {
    this.setState({
      selectedDate
    }, () => {
      this.getAssetTransferTracking(selectedDate);
    });
  }

  /**
   * Render child items when click expand button
   * @returns 
   */
  renderChildrenItem = () => {
    const { dataDetail } = this.state;
    return dataDetail
      ? [...dataDetail].map((item, index) => {
        return (
          <View style={styles.viewItem} key={index}>
            <View style={styles.viewItemInfo}>
              <Image style={styles.image} source={noImage} />
              <View>
                <Text style={styles.textFont}>
                  AST No.: {item?.assetTransferNo}
                </Text>
                <Text style={styles.textFont}>
                  Asset Code: {item?.assetMasterTbl?.assetNo}
                </Text>
                <Text style={styles.textFont}>
                  {item?.assetMasterTbl?.description}
                </Text>
                <Text style={styles.textFont}>
                  {item?.assetMasterTbl?.quantity ? item?.assetMasterTbl?.quantity : 0} {item?.assetMasterTbl?.uom}
                </Text>
              </View>
              <View style={styles.viewQty}>
                <Text style={[styles.textFont, styles.textTitle]}>
                  {item?.assetMasterTbl?.quantity}
                </Text>
              </View>
            </View>
          </View>
        );
      })
      : null;
  };

  render() {
    const { list, loadingMore, fields, selectedDate } = this.state;
    const minimumDate = new Date();

    minimumDate.setDate((new Date()).getDate() - 7);

    return (
      <SafeAreaView >
        <View style={styles.mainScreen}>
          <View style={styles.fieldHeader}>
            {this.renderDate()}
          </View>
          <ListForm
            listData={list}
            handleLoadMore={this.handleLoadMore}
            loadingMore={loadingMore}
            handleDelete={this.handleDelete}
            handleDetailItem={this.handleDetailItem}
            renderChildrenItem={this.renderChildrenItem}
            handleClickOnItems={this.handleViewDetailsItem}
            disabledSwipeRight={true}
          />
          <DatePicker
            ref={ref => (this.calendarComponent = ref)}
            onDateChange={this.onChangeDate}
            value={selectedDate}
            minimumDate={minimumDate}
          />
        </View>
      </SafeAreaView>
    );
  }
};
  
export default AssetTransferTrackingList;