import React, {Component} from 'react';
import {Dimensions, PanResponder} from 'react-native';
import {Text, View, Button, Icon} from 'native-base';
import {withTranslation} from 'react-i18next';
import Toast from 'react-native-easy-toast';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import EditableTable from '../../../shared/table/EditableTable';
import {
  deepCopy,
  detectPortrait,
  mapDbToSAP,
  formatHhDoc,
  isConnectedToTheNetwork,
} from '../../../../utils/functions';
import {searchWithPK} from '../../../../services/database/Search';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import values from 'lodash/values';
import isArray from 'lodash/isArray';
import {openMessageDialog} from '../../../../redux/message-dialog/MessageDialog.actions';

import {MESSAGE} from '../../../../constants/message';
import {
  FieldConstant,
  buttonConstant,
  asyncStorageConst,
  dialogConstant,
  NotificationType,
  aMinute,
  inactivityTimeOut,
  maxValueQuantity,
} from '../../../../constants/constants';
import {tableConstant} from '../../../../database/Constant';
import {notificationService} from '../../../../services/notificationService';
import Field from '../../../shared/fields/field';
import {columns, scanCodeFields} from './stock-count-detail.config';
import {stockCountService} from '../../../../services/stockCountService';
import {
  deleteRow,
  update,
  deleteAfterSaveSAP,
} from '../../../../services/database/CRUD';

import ActionButtons from '../../../shared/buttons/ActionButtons';
import Styles from './StockCountDetail.style';

class StockCountDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      page: 1,
      list: [],
      loading: false,
      loadingMore: false,
      refreshing: false,
      fields: [...scanCodeFields],
      isPortTrait: false,
      cellChanged: {
        idName: '',
        fieldName: '',
        idValue: '',
        scanType: '',
      },
      Hh_Doc: '',
      messageDialog: MESSAGE.M015,
      isHoneyWell: 'false',
      stockDetail: {},
      fromUnfinish: false,
      isExpanded: false,
    };
    this.actions = {
      deleteOffline: () => this.deleteOffline(),
      saveOffline: () => this.saveOffline(),
      saveToSAP: () => this.saveToSAP(),
    };
  }

  _isMounted = true;
  minutesCount = 1;

  getDeviceInfo = async () => {
    // Get device info
    let isHoneyWell = await AsyncStorage.getItem(asyncStorageConst.isHoneyWell);
    this.setState({isHoneyWell: isHoneyWell});
  };

  eventActiveInScreen = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => {
      this.minutesCount = 1;
      this.resetTimer();
      return false;
    },
  });

  componentDidMount() {
    this.getPartsOfStockCount();
    this.getDeviceInfo();
    this.detectOrientation();
    Dimensions.addEventListener('change', data => {
      const {height, width} = data.window;
      this.detectOrientation(width, height);
    });
    //
    this.subscription = notificationService
      .onNotify()
      .subscribe(notification => {
        // Fix bug Camera goToList because notify event active in CodeScan screen
        let timeOut = false;
        switch (notification.type) {
          case NotificationType.IS_BACKGROUNDING:
            this.saveOffline(NotificationType.IS_BACKGROUNDING, timeOut);
            break;
          case NotificationType.IS_NAVIGATING_BACK:
            this.saveOffline(NotificationType.IS_NAVIGATING_BACK, timeOut);
            break;
          default:
            break;
        }
      });
    this.timer = setTimeout(() => this.resetTimer(), aMinute);
  }

  resetTimer() {
    clearTimeout(this.timer);
    if (this.minutesCount === inactivityTimeOut) {
      this.minutesCount = 1;
      this.saveOfflineAfterTimeOut();
      return;
    }
    this.minutesCount = this.minutesCount + 1;
    this.timer = setTimeout(() => this.resetTimer(), aMinute);
  }

  saveOfflineAfterTimeOut() {
    const timeout = true;
    const notify = false;
    this.saveOffline(notify, timeout);
  }

  componentWillUnmount() {
    this._isMounted = false;
    Dimensions.removeEventListener('change', this.detectOrientation());
    this.subscription.unsubscribe();
    clearTimeout(this.timer);
  }

  detectOrientation = (screenWidth, screenHeight) => {
    let isPortrait = detectPortrait(screenWidth, screenHeight);
    if (this._isMounted) {
      this.setState({
        isPortTrait: isPortrait,
      });
    }
  };

  handleScanning = ({value, name, scanType}) => {
    const {list} = this.state;
    const {navigate} = this.props.navigation;
    const isQuickScan = scanType === FieldConstant.scan.QUICK_SCAN;
    const {t} = this.props;

    // avoid change the initial list when reloading table
    let newItems = deepCopy(list);
    const partIndexFound = findIndex(newItems, ['Sap_Part', value]);
    let cellChanged = {};
    if (partIndexFound >= 0) {
      cellChanged = {
        idName: 'Sap_Part',
        idValue: value,
        // HONDAIPB-514: scan with the same partNo
        idIndex: newItems[partIndexFound].Sap_DocItem,
        idIndexName: 'Sap_DocItem',
      };

      // case: part have a zero count
      if (newItems[partIndexFound].Sap_CheckBox === 'X') {
        this.setState({cellChanged, scanType}, () => {
          isQuickScan && this.goScanScreen(scanType, navigate);
          //[CR] - 15/09/2020 - Increase duration toast
          this.toast.show(t(MESSAGE.M016), timingToastMsg);
        });

        return;
      }

      if (isQuickScan) {
        if (newItems[partIndexFound].Hh_Quantity1 === maxValueQuantity) {
          this.callMessage(MESSAGE.M008);
          return;
        }
        newItems[partIndexFound].Hh_Quantity1 = (
          Number(newItems[partIndexFound].Hh_Quantity1) + 1
        ).toString();
      } else {
        cellChanged.fieldName = 'Hh_Quantity1';
      }

      this.table && this.table.scrollToItem(partIndexFound);
      //
      this.toast.show(value);

      this.setState({
        list: newItems,
        cellChanged,
        scanType: scanType,
      });
    } else {
      // handle part not found
      this.setState(
        {
          cellChanged: {},
          scanType: scanType,
        },
        () => {
          //[CR] - 15/09/2020 - Increase duration toast
          this.toast.show(t(MESSAGE.M005), timingToastMsg);
        },
      );
    }
    //
    isQuickScan && this.goScanScreen(scanType, navigate);
  };

  goScanScreen = (scanType, navigate) => {
    const {isHoneyWell} = this.state;
    if (isHoneyWell === 'false') {
      setTimeout(() => {
        navigate('CodeScan', {
          onGoBack: data => this.handleScanning({value: data, scanType}),
        });
      }, 1000);
    }
  };

  onCellChange = (value, field, rowData) => {
    const {list, cellChanged} = this.state;
    // if focusing cell which is different the cell scanned is out of scanning
    const isOnScanning = cellChanged.idValue === rowData.Sap_Part;
    let newCellChanged = {
      idName: 'Sap_Part',
      idValue: rowData.Sap_Part,
      // HONDAIPB-514: scan with the same partNo
      idIndex: rowData.Sap_DocItem,
      idIndexName: 'Sap_DocItem',
    };

    // Event focus cell
    if (!field) {
      this.setState({
        cellChanged: newCellChanged,
        scanType: isOnScanning ? this.state.scanType : '',
      });
      return;
    }

    // Event input cell
    let newItems = deepCopy(list);
    const partIndexFound = findIndex(newItems, {
      Sap_Part: rowData.Sap_Part,
      Sap_DocItem: rowData.Sap_DocItem,
    });
    newItems[partIndexFound][field] = '' + value;

    // handle with zero count
    if (field === 'Sap_CheckBox' && value === 'X') {
      newItems[partIndexFound].Hh_Quantity1 = '0';
    }

    newCellChanged.fieldName = field === 'Sap_CheckBox' ? '' : 'Hh_Quantity1';

    this.setState({
      list: newItems,
      cellChanged: newCellChanged,
      scanType: isOnScanning ? this.state.scanType : '',
    });
  };

  getPartsOfStockCount = async () => {
    const stockDetail = await this.getStockCount();
    if (stockDetail) {
      let parts = get(stockDetail, 'NvStkHdToItm', []);
      // items object to array
      if (!isArray(parts)) {
        parts = values(parts);
      }
      this.setState({
        list: parts,
        Hh_Doc: stockDetail.Hh_Doc,
        stockDetail,
        fromUnfinish: stockDetail.Hh_UnfinishedDoc,
      });
    }
  };

  handleRefresh = async () => {
    await this.getPartsOfStockCount();
  };

  getStockCount = () => {
    const dataFromRoute = get(
      this.props,
      'navigation.state.params.data',
      false,
    );
    // data from Login page
    if (dataFromRoute.headerId) {
      return searchWithPK(
        tableConstant.name.DOC_HEADER,
        dataFromRoute.headerId,
      );
    } else {
      return dataFromRoute;
    }
  };

  saveToSAP = async () => {
    let {list, Hh_Doc, stockDetail: stock} = this.state;

    const token = await AsyncStorage.getItem(asyncStorageConst.TOKEN);
    const isConnected = await isConnectedToTheNetwork();

    if (!isConnected) {
      this.callMessage(MESSAGE.M010);
      return;
    }

    if (stock) {
      const isEmptyQuantity = !!find(
        list,
        item => !Number(item.Hh_Quantity1) && !item.Sap_CheckBox,
      );
      if (isEmptyQuantity) {
        this.callMessage(MESSAGE.M001);
        return;
      }
      //
      let itemClone = await deepCopy(list),
        headerClone = await deepCopy(stock);
      // Case: non login
      if (!token) {
        // TODO: save offline
        update(tableConstant.name.DOC_HEADER, Hh_Doc, itemClone, headerClone)
          .then(() => this.goToLogin(headerClone.id))
          .catch(() => this.callMessage(MESSAGE.M017));
      } else {
        headerClone = mapDbToSAP(headerClone, itemClone);
        stockCountService.saveStockCount(headerClone).then(res => {
          const mess = get(res, 'd.NvStkHdToRet.results[0].Message', '');
          if (mess.length > 0) {
            deleteAfterSaveSAP(tableConstant.name.DOC_HEADER, Hh_Doc)
              .then(() => this.callMessage(mess))
              .catch(() => this.callMessage(MESSAGE.M017));
          }
        });
      }
    }
  };

  goToLogin = id => {
    const {navigate} = this.props.navigation;
    navigate('Login', {
      data: {
        headerId: id,
        detailPage: 'StockCountDetail',
      },
    });
  };

  excDeleteOffline = async () => {
    const {fromUnfinish, stockDetail} = this.state;

    if (!fromUnfinish) {
      // Refresh table
      this.getPartsOfStockCount();
    } else {
      deleteRow(tableConstant.name.DOC_HEADER, stockDetail.id).then(() => {
        this.goToList();
      });
    }
  };

  deleteOffline = () => {
    this.callMessage(MESSAGE.M004);
  };

  saveOffline = async (notify, isTimeout) => {
    let {list, Hh_Doc, stockDetail} = this.state;
    // Clone data avoid out scope transaction from list
    let itemClone = await deepCopy(list),
      headerClone = await deepCopy(stockDetail);
    update(tableConstant.name.DOC_HEADER, Hh_Doc, itemClone, headerClone)
      .then(() => {
        if (isTimeout) {
          return;
        }
        // Fix bug Camera goToList because notify event active in CodeScan screen
        // Variables notify will be false when function saveOfflineAfterTimeOut() call
        // Other cases, check If notify equal NotificationType constant
        if (notify) {
          if (notify === NotificationType.IS_NAVIGATING_BACK) {
            this.goToList();
          } else {
            return;
          }
        } else {
          this.callMessage(MESSAGE.M003);
        }
      })
      .catch(() => this.callMessage(MESSAGE.M017));
  };

  handleActionButtons = actionName => {
    this.actions[actionName]();
  };

  goToList = () => {
    const {fromUnfinish} = this.state;
    const {navigate} = this.props.navigation;
    navigate(!fromUnfinish ? 'StockCountList' : 'UnfinishedDocumentList');
  };

  callMessage = message => {
    const {t} = this.props;
    let messObj;
    switch (message) {
      case MESSAGE.M001:
        messObj = {
          content: t(MESSAGE.M001, {fieldName: t('Counting-Msg')}),
          buttons: [
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.NONE_FUNCTION,
            },
          ],
        };
        break;
      case MESSAGE.M003:
        messObj = {
          content: t(MESSAGE.M003),
          buttons: [
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.FUNCTION,
              action: () => this.goToList(),
            },
          ],
        };
        break;
      case MESSAGE.M004:
        messObj = {
          content: t(MESSAGE.M004),
          buttons: [
            {
              name: buttonConstant.BUTTON_CANCEL,
              type: dialogConstant.button.NONE_FUNCTION,
            },
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.FUNCTION,
              action: () => this.excDeleteOffline(),
            },
          ],
        };
        break;
      case MESSAGE.M008:
        messObj = {
          content: t(MESSAGE.M008, {
            fieldName: t('Counting-Msg'),
            fieldSize: '5',
          }),
          buttons: [
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.NONE_FUNCTION,
            },
          ],
        };
        break;
      case MESSAGE.M010:
      case MESSAGE.M013:
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
      // [#HONDAIPB-FixBug] - 22/06/2020 - Message from SAP incorrect
      // Case needless translate for messages from SAP
      default:
        messObj = {
          content: message,
          buttons: [
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.FUNCTION,
              action: () => this.goToList(),
            },
          ],
        };
        break;
    }
    openMessageDialog(messObj);
  };

  handleDetailContent = () => {
    const {isExpanded} = this.state;
    this.setState({isExpanded: !isExpanded});
  };

  render() {
    const {t, navigation} = this.props;
    const {
      list,
      loadingMore,
      refreshing,
      fields,
      cellChanged,
      isPortTrait,
      scanType,
      stockDetail,
      isExpanded,
    } = this.state;

    return (
      <View style={Styles.container} {...this.eventActiveInScreen.panHandlers}>
        <Toast
          ref={ref => {
            this.toast = ref;
          }}
          style={Styles.toast}
          positionValue={0}
          position="top"
        />
        <View style={Styles.viewPadding}>
          <Button
            onPress={() => this.handleDetailContent()}
            style={Styles.buttonDetail}>
            <Text>
              <Text style={[Styles.labelBold, Styles.textColor]}>
                {t('HH Document')}
              </Text>
              <Text style={Styles.textColor}>
                : {formatHhDoc(stockDetail.Hh_Doc)}
              </Text>
            </Text>
            <Icon
              type="FontAwesome"
              name={isExpanded ? 'angle-down' : 'angle-up'}
              style={Styles.textColor}
            />
          </Button>
        </View>
        {isExpanded && (
          <View style={[isPortTrait ? Styles.viewDataDetails : '']}>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('HH Document')}: </Text>
              {formatHhDoc(stockDetail.Hh_Doc)}
            </Text>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('Date')}: </Text>
              {moment(stockDetail.Sap_DocDate).format('DD.MM.YYYY')}
            </Text>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('Count Document No.')}: </Text>
              {stockDetail.Sap_Doc}
            </Text>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('Year')}: </Text>
              {stockDetail.Sap_DocYear}
            </Text>
          </View>
        )}
        <View
          style={[
            Styles.viewEditable,
            isPortTrait ? Styles.flexHeight : Styles.autoHeight,
          ]}>
          <EditableTable
            ref={ref => {
              this.table = ref;
            }}
            columns={columns}
            values={list}
            onCellChange={(value, field, rowData) => {
              this.onCellChange(value, field, rowData);
            }}
            loadingMore={loadingMore}
            refreshing={refreshing}
            handleRefresh={this.handleRefresh}
            cellChanged={cellChanged}
            onFocusCell={this.onCellChange}
            zeroCount={true}
            scrollToRight={scanType === FieldConstant.scan.QUICK_SCAN}
          />
        </View>
        <View style={[Styles.fixedFooter, isPortTrait ? Styles.flexRow : '']}>
          <View style={[isPortTrait ? Styles.scanning : '']}>
            <Field
              conditionalArray={fields}
              onChange={this.handleScanning}
              navigation={navigation}
              isPortTrait={isPortTrait}
            />
          </View>
          <ActionButtons
            isPortTrait={isPortTrait}
            onPress={this.handleActionButtons}
          />
        </View>
      </View>
    );
  }
}

export default withTranslation()(StockCountDetail);
