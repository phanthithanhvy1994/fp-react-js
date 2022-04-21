import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import find from 'lodash/find';
import {Dimensions, PanResponder} from 'react-native';
import {Text, View, Button, Icon} from 'native-base';
import Toast from 'react-native-easy-toast';
import AsyncStorage from '@react-native-community/async-storage';

import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import values from 'lodash/values';
import isArray from 'lodash/isArray';
import moment from 'moment';

import Field from '../../../shared/fields/field';
import EditableTable from '../../../shared/table/EditableTable';
import ActionButtons from '../../../shared/buttons/ActionButtons';
import {MESSAGE} from '../../../../constants/message';

import {openMessageDialog} from '../../../../redux/message-dialog/MessageDialog.actions';
import {stockInService} from '../../../../services/stockInService';
import {
  deleteRow,
  update,
  deleteAfterSaveSAP,
} from '../../../../services/database/CRUD';
import {searchWithPK} from '../../../../services/database/Search';

import {
  columns,
  scanCodeFields,
  recipientFields,
} from './return-service-detail.config';

import {
  deepCopy,
  detectPortrait,
  onChangeInput,
  mapDbToSAP,
  formatHhDoc,
  isConnectedToTheNetwork,
} from '../../../../utils/functions';

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
import {tableConstant} from '../../../../database/Constant';

import Styles from './ReturnServiceDetail.style';
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
  isShowRecipient: false,
};

class ReturnServiceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: INITIAL_STATE.list,
      loading: INITIAL_STATE.loading,
      refreshing: INITIAL_STATE.refreshing,
      isPortTrait: INITIAL_STATE.isPortTrait,
      fields: [...scanCodeFields],
      recipientField: [...recipientFields],
      cellChanged: INITIAL_STATE.cellChanged,
      Hh_Doc: INITIAL_STATE.Hh_Doc,
      returnDetail: {},
      isShowRecipient: INITIAL_STATE.isShowRecipient,
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
    this.getPartsOfReturn();
    this.getDeviceInfo();
    this.detectOrientation();
    Dimensions.addEventListener('change', data => {
      const {height, width} = data.window;
      this.detectOrientation(width, height);
    }); //
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

    if (partIndexFound >= 0) {
      //cellChanged is info item to focus the cell
      let cellChanged = {
        idName: 'Sap_Part',
        idValue: value,
        // HONDAIPB-514: scan with the same partNo
        idIndex: newItems[partIndexFound].Sap_DocItem,
        idIndexName: 'Sap_DocItem',
      };

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
      this.setState({
        list: newItems,
        cellChanged,
        scanType: scanType,
      });
      // Show toast
      this.toast.show(value);
      // Repeat to Scan screen
    } else {
      // handle part not found
      this.setState({cellChanged: {}});
      //[CR] - 15/09/2020 - Increase duration toast
      this.toast.show(t(MESSAGE.M005), timingToastMsg);
    }
    // Repeat to Scan screen
    isQuickScan && this.goScanScreen(scanType, navigate);
  };

  onCellChange = (value, field, rowData) => {
    const {list, cellChanged} = this.state;
    const isOnScanning = cellChanged.idValue === rowData.Sap_Part;
    const newCellChanged = {
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

    // avoid change the initial list when reloading table
    let newItems = deepCopy(list);
    const partIndexFound = findIndex(newItems, {
      Sap_Part: rowData.Sap_Part,
      Sap_DocItem: rowData.Sap_DocItem,
    });
    newItems[partIndexFound][field] = '' + value;

    this.setState({
      list: newItems,
      cellChanged: newCellChanged,
      scanType: isOnScanning ? this.state.scanType : '',
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

  getPartsOfReturn = async () => {
    const returnDetail = await this.getReturnSales();

    if (returnDetail) {
      //
      if (returnDetail.Sap_Ref1Type === 'SERVICE') {
        // Save Recipient field. This case exist in Stock-out and Return from Service screen
        this.onRecipientChange({
          target: {value: returnDetail.Hh_Recipient, name: 'Hh_Recipient'},
        });
        this.setState({isShowRecipient: true});
      }
      //
      let parts = returnDetail.NvStkHdToItm;
      // items object to array
      if (!isArray(parts)) {
        parts = values(parts);
      }
      this.setState({
        list: parts,
        Hh_Doc: returnDetail.Hh_Doc,
        returnDetail,
        fromUnfinished: returnDetail.Hh_UnfinishedDoc,
      });
    }
  };

  getReturnSales = () => {
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
    this.getPartsOfReturn();
  };

  saveToSAP = async () => {
    const {t} = this.props;
    // Get State
    let {list, Hh_Doc, returnDetail, recipientField} = this.state;

    const isConnected = await isConnectedToTheNetwork();
    const token = await AsyncStorage.getItem(asyncStorageConst.TOKEN);

    if (!isConnected) {
      this.callMessage(MESSAGE.M010);
      return;
    }

    if (
      this.isRecipientFieldEmpty() &&
      returnDetail.Sap_Ref1Type === 'SERVICE'
    ) {
      openMessageDialog({
        content: t(MESSAGE.M001, {fieldName: t('Recipient')}),
        buttons: [
          {
            name: buttonConstant.BUTTON_OK,
            type: dialogConstant.button.NONE_FUNCTION,
          },
        ],
      });
      return;
    }

    if (returnDetail) {
      const isEmptyQuantity = !!find(list, item => !item.Hh_Quantity1);

      if (isEmptyQuantity) {
        this.callMessage(MESSAGE.M001);
        return;
      }

      //
      // Clone Obj
      let itemClone = await deepCopy(list),
        headerClone = await deepCopy(returnDetail);
      // Save Recipient field. This case exist in Stock-out and Return from Service screen
      headerClone.Hh_Recipient = recipientField[0].value.toString().trim();

      // Case: non login
      if (!token) {
        // Save offline
        update(tableConstant.name.DOC_HEADER, Hh_Doc, itemClone, headerClone)
          .then(() => this.goToLogin(headerClone.id))
          .catch(() => this.callMessage(MESSAGE.M017));
      } else {
        //
        headerClone = mapDbToSAP(headerClone, itemClone);
        stockInService.saveReturnSale(headerClone).then(res => {
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
        detailPage: 'ReturnServiceDetail',
      },
    });
  };

  excDeleteOffline = () => {
    // Get State
    const {fromUnfinished, returnDetail} = this.state;
    //
    if (!fromUnfinished) {
      // Refresh table
      this.getPartsOfReturn();
    } else {
      deleteRow(tableConstant.name.DOC_HEADER, returnDetail.id).then(() => {
        this.goToList();
      });
    }
  };

  deleteOffline = () => {
    this.callMessage(MESSAGE.M004);
  };

  saveOffline = async (notify, isTimeout) => {
    let {list, Hh_Doc, returnDetail, recipientField} = this.state;
    // Clone data avoid out scope transaction from list
    let itemClone = await deepCopy(list),
      headerClone = await deepCopy(returnDetail);
    // Save Recipient field. This case exist in Stock-out and Return from Service screen
    headerClone.Hh_Recipient = recipientField[0].value;
    //
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

  onRecipientChange = data => {
    const newInputFields = onChangeInput(recipientFields, data);
    this.setState({recipientField: newInputFields, cellChanged: {}});
  };

  handleActionButtons = actionName => {
    this.actions[actionName]();
  };

  isRecipientFieldEmpty = () => {
    let recipientField = this.state.recipientField;
    if (recipientField[0].value) {
      return false;
    }
    return true;
  };

  goToList = () => {
    // Get navigation props
    const {navigate} = this.props.navigation;
    const {fromUnfinished} = this.state;
    navigate(!fromUnfinished ? 'ReturnServiceList' : 'UnfinishedDocumentList');
  };

  callMessage = message => {
    const {t} = this.props;
    let messObj;
    switch (message) {
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
      refreshing,
      fields,
      recipientField,
      cellChanged,
      isPortTrait,
      scanType,
      returnDetail,
      isShowRecipient,
      isExpanded,
    } = this.state;

    return (
      <View style={Styles.container} {...this.eventActiveInScreen.panHandlers}>
        <Toast
          ref={ref => {
            this.toast = ref;
          }}
          style={Styles.toast}
          position="top"
          positionValue={0}
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
                : {formatHhDoc(returnDetail.Hh_Doc)}
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
          <View style={Styles.viewDataDetails}>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('HH Document')}: </Text>
              {formatHhDoc(returnDetail.Hh_Doc)}
            </Text>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('Date')}: </Text>
              {moment(returnDetail.Sap_DocDate).format('DD.MM.YYYY')}
            </Text>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('Return No.')}: </Text>
              {returnDetail.Sap_Doc}
            </Text>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('Order No.')}: </Text>
              {returnDetail.Sap_Ref1}
            </Text>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('Invoice No.')}: </Text>
              {returnDetail.Sap_Ref2}
            </Text>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('Ref. Packing')}: </Text>
              {returnDetail.Sap_Ref3}
            </Text>
            <Text style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('Customer')}: </Text>
              {returnDetail.Sap_Bp}
            </Text>
            <Text style={[isPortTrait ? Styles.widthBpName : Styles.autoWidth]}>
              <Text style={Styles.labelBold}>{t('Customer Name')}: </Text>
              {returnDetail.Sap_BpName}
            </Text>
          </View>
        )}
        {isShowRecipient && (
          <View style={[isPortTrait ? Styles.flexRow : '']}>
            <View style={Styles.alignItems}>
              <Text style={Styles.textRecipient}>
                {t('Recipient')} <Text style={Styles.require}>*</Text>
              </Text>
            </View>
            <View style={[isPortTrait ? Styles.flexView : '']}>
              <Field
                conditionalArray={recipientField}
                onChange={this.onRecipientChange}
                navigation={navigation}
              />
            </View>
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
            refreshing={refreshing}
            handleRefresh={this.handleRefresh}
            cellChanged={cellChanged}
            onFocusCell={this.onCellChange}
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

export default withTranslation()(ReturnServiceDetail);
