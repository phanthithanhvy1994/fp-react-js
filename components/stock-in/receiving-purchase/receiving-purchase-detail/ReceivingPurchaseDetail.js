import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {Dimensions, PanResponder} from 'react-native';
import {Text, View, Button, Icon} from 'native-base';
import Toast from 'react-native-easy-toast';

import AsyncStorage from '@react-native-community/async-storage';

import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import moment from 'moment';
import values from 'lodash/values';
import isArray from 'lodash/isArray';
import find from 'lodash/find';

import {openMessageDialog} from '../../../../redux/message-dialog/MessageDialog.actions';

import EditableTable from '../../../shared/table/EditableTable';
import ActionButtons from '../../../shared/buttons/ActionButtons';
import {MESSAGE} from '../../../../constants/message';
import Field from '../../../shared/fields/field';

import {stockInService} from '../../../../services/stockInService';
import {
  deleteRow,
  update,
  deleteAfterSaveSAP,
} from '../../../../services/database/CRUD';
import {searchWithPK} from '../../../../services/database/Search';

import {tableConstant} from '../../../../database/Constant';
import {
  FieldConstant,
  buttonConstant,
  asyncStorageConst,
  dialogConstant,
  NotificationType,
  aMinute,
  inactivityTimeOut,
  maxValueQuantity,
  timingToastMsg,
} from '../../../../constants/constants';

import {columns, scanCodeFields} from './receiving-purchase-detail.config';
import numeral from 'numeral';
import {
  deepCopy,
  detectPortrait,
  mapDbToSAP,
  formatHhDoc,
  isConnectedToTheNetwork,
} from '../../../../utils/functions';

import styles from './ReceivingPurchaseDetail.style';
import {notificationService} from '../../../../services/notificationService';

const INITIAL_STATE = {
  list: [],
  loading: false,
  refreshing: false,
  isPortTrait: false,
  Hh_Doc: '',
  cellChanged: {
    idName: 'Sap_Part',
    fieldName: '',
    idValue: '',
    selected: '',
  },
};
class ReceivingPurchaseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: INITIAL_STATE.list,
      loading: INITIAL_STATE.loading,
      refreshing: INITIAL_STATE.refreshing,
      isPortTrait: INITIAL_STATE.isPortTrait,
      fields: [...scanCodeFields],
      cellChanged: INITIAL_STATE.cellChanged,
      Hh_Doc: INITIAL_STATE.Hh_Doc,
      purchaseDetail: {},
      fromUnfinished: false,
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
    this.getPartsOfPurchase();
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
    const {t} = this.props;
    const isQuickScan = scanType === FieldConstant.scan.QUICK_SCAN;

    // avoid change the initial list when reloading table
    let newItems = deepCopy(list);
    const partIndexFound = findIndex(newItems, ['Sap_Part', value]);
    //cellChanged is info item to focus the cell
    let cellChanged = {};

    if (partIndexFound >= 0) {
      if (isQuickScan) {
        if (newItems[partIndexFound].Hh_Quantity1 === maxValueQuantity) {
          this.callMessage(MESSAGE.M008);
          return;
        }
        newItems[partIndexFound].Hh_Quantity1 = (
          Number(newItems[partIndexFound].Hh_Quantity1) + 1
        ).toString();

        cellChanged = {
          idName: 'Sap_Part',
          idValue: value,
          // HONDAIPB-514: scan with the same partNo
          idIndex: newItems[partIndexFound].Sap_Ref2Item,
          idIndexName: 'Sap_Ref2Item',
          idIndex2: newItems[partIndexFound].Sap_Ref2,
          idIndexName2: 'Sap_Ref2',
        };
      } else {
        cellChanged = {
          idName: 'Sap_Part',
          fieldName: 'Hh_Quantity1',
          idValue: value,
          // HONDAIPB-514: scan with the same partNo
          idIndex: newItems[partIndexFound].Sap_Ref2Item,
          idIndexName: 'Sap_Ref2Item',
          idIndex2: newItems[partIndexFound].Sap_Ref2,
          idIndexName2: 'Sap_Ref2',
        };
      }

      this.table && this.table.scrollToItem(partIndexFound);
      this.setState({
        list: newItems,
        cellChanged,
        scanType: scanType,
      });
      // Show toast
      this.toast.show(value);
    } else {
      //handle part not found
      this.setState({cellChanged: {}});
      //[CR] - 15/09/2020 - Increase duration toast
      this.toast.show(t(MESSAGE.M005), timingToastMsg);
    }
    // Repeat to Scan screen
    isQuickScan && this.goScanScreen(scanType, navigate);
  };

  onCellChange = (value, field, rowData) => {
    const {list, cellChanged} = this.state;
    const newCellChanged = {
      idName: 'Sap_Part',
      idValue: rowData.Sap_Part,
      // HONDAIPB-514: scan with the same partNo
      idIndex: rowData.Sap_Ref2Item,
      idIndexName: 'Sap_Ref2Item',
      idIndex2: rowData.Sap_Ref2,
      idIndexName2: 'Sap_Ref2',
    };
    // Event focus cell
    if (!field) {
      this.setState({
        cellChanged: newCellChanged,
        scanType: '',
      });
      return;
    }

    // avoid change the initial list when reloading table
    let newItems = deepCopy(list);

    const partIndexFound = findIndex(newItems, {
      Sap_Part: rowData.Sap_Part,
      Sap_Ref2Item: rowData.Sap_Ref2Item,
      Sap_Ref2: rowData.Sap_Ref2,
    });
    newItems[partIndexFound][field] = '' + value;

    this.setState({
      list: newItems,
      cellChanged: newCellChanged,
      scanType: '',
    });
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

  getPartsOfPurchase = async () => {
    const purchaseDetail = await this.getPurchase();
    if (purchaseDetail) {
      let parts = get(purchaseDetail, 'NvStkHdToItm', []);
      // items object to array
      if (!isArray(parts)) {
        parts = values(parts);
      }
      this.setState({
        list: parts,
        Hh_Doc: purchaseDetail.Hh_Doc,
        purchaseDetail,
        fromUnfinished: purchaseDetail.Hh_UnfinishedDoc,
      });
    }
  };

  getPurchase = () => {
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

  handleRefresh = () => {
    this.getPartsOfPurchase();
  };

  saveToSAP = async () => {
    let {Hh_Doc, list, purchaseDetail: purchase} = this.state;

    const isConnected = await isConnectedToTheNetwork();
    const token = await AsyncStorage.getItem(asyncStorageConst.TOKEN);

    if (!isConnected) {
      this.callMessage(MESSAGE.M010);
      return;
    }

    if (purchase) {
      const isEmptyQuantity = !!find(list, item => !item.Hh_Quantity1);

      if (isEmptyQuantity) {
        this.callMessage(MESSAGE.M001);
        return;
      }
      // Clone Obj
      let itemClone = await deepCopy(list),
        headerClone = await deepCopy(purchase);
      // Case: non login
      if (!token) {
        // Save offline
        update(tableConstant.name.DOC_HEADER, Hh_Doc, itemClone, headerClone)
          .then(() => this.goToLogin(headerClone.id))
          .catch(() => this.callMessage(MESSAGE.M017));
      } else {
        // Map data
        headerClone = await mapDbToSAP(headerClone, itemClone);
        stockInService.savePurchasing(headerClone).then(res => {
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
        detailPage: 'ReceiveFromPurchasingDetail',
      },
    });
  };

  excDeleteOffline = () => {
    const {purchaseDetail, fromUnfinished} = this.state;
    if (!fromUnfinished) {
      // Refresh table
      this.getPartsOfPurchase();
    } else {
      deleteRow(tableConstant.name.DOC_HEADER, purchaseDetail.id).then(() => {
        this.goToList();
      });
    }
  };

  deleteOffline = () => {
    this.callMessage(MESSAGE.M004);
  };

  saveOffline = async (notify, isTimeout) => {
    let {list, Hh_Doc, purchaseDetail} = this.state;
    let itemClone = await deepCopy(list),
      headerClone = await deepCopy(purchaseDetail);
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
    // Get navigation props
    const {navigate} = this.props.navigation;
    const {fromUnfinished} = this.state;
    navigate(
      !fromUnfinished ? 'ReceiveFromPurchasingList' : 'UnfinishedDocumentList',
    );
  };

  callMessage = message => {
    const {t} = this.props;
    let messObj;
    switch (message) {
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
          content: t(MESSAGE.M008, {fieldName: t('Received'), fieldSize: '9'}),
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
      case MESSAGE.M001:
        messObj = {
          content: t(MESSAGE.M001, {fieldName: t('Received')}),
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
      fields,
      refreshing,
      cellChanged,
      isPortTrait,
      scanType,
      purchaseDetail,
      isExpanded,
    } = this.state;

    return (
      <View style={styles.container} {...this.eventActiveInScreen.panHandlers}>
        <Toast
          ref={ref => {
            this.toast = ref;
          }}
          style={styles.toast}
          positionValue={0}
          position="top"
        />
        <View style={styles.viewPadding}>
          <Button
            onPress={() => this.handleDetailContent()}
            style={styles.buttonDetail}>
            <Text>
              <Text style={[styles.labelBold, styles.textColor]}>
                {t('HH Document')}
              </Text>
              <Text style={styles.textColor}>
                : {formatHhDoc(purchaseDetail.Hh_Doc)}
              </Text>
            </Text>
            <Icon
              type="FontAwesome"
              name={isExpanded ? 'angle-down' : 'angle-up'}
              style={styles.textColor}
            />
          </Button>
        </View>
        {isExpanded && (
          <View
            style={[
              styles.viewPadding,
              isPortTrait ? styles.viewDataDetails : '',
            ]}>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('HH Document')}: </Text>
              {formatHhDoc(purchaseDetail.Hh_Doc)}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Date')}: </Text>
              {moment(purchaseDetail.Sap_DocDate).format('DD.MM.YYYY')}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Invoice No.')}: </Text>
              {purchaseDetail.Sap_Doc}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Tax Invoice No.')}: </Text>
              {purchaseDetail.Sap_Ref1}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Unpacking No.')}: </Text>
              {purchaseDetail.Sap_Ref2}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Vendor')}: </Text>
              {purchaseDetail.Sap_Bp}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Gross Price')}: </Text>
              {numeral(purchaseDetail.Sap_AmountIncVat).format('0,0.00')}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Vendor Name')}: </Text>
              {purchaseDetail.Sap_BpName}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.viewEditable,
            isPortTrait ? styles.flexHeight : styles.autoHeight,
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
            refreshing={refreshing}
            handleRefresh={this.handleRefresh}
            cellChanged={cellChanged}
            onFocusCell={this.onCellChange}
            scrollToRight={scanType === FieldConstant.scan.QUICK_SCAN}
          />
        </View>
        <View style={[styles.fixedFooter, isPortTrait ? styles.flexRow : '']}>
          <View style={[isPortTrait ? styles.scanning : '']}>
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

export default withTranslation()(ReceivingPurchaseDetail);
