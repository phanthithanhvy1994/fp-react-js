import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {Dimensions, PanResponder} from 'react-native';
import {Text, View, Button, Icon} from 'native-base';
import Toast from 'react-native-easy-toast';

import AsyncStorage from '@react-native-community/async-storage';
import find from 'lodash/find';
import EditableTable from '../../../shared/table/EditableTable';
import {
  deepCopy,
  detectPortrait,
  mapDbToSAP,
  formatHhDoc,
  isConnectedToTheNetwork,
} from '../../../../utils/functions';
import ActionButtons from '../../../shared/buttons/ActionButtons';

import {openMessageDialog} from '../../../../redux/message-dialog/MessageDialog.actions';

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
import {MESSAGE} from '../../../../constants/message';

import Field from '../../../shared/fields/field';

import {stockInService} from '../../../../services/stockInService';
import {
  deleteRow,
  update,
  deleteAfterSaveSAP,
} from '../../../../services/database/CRUD';
import {searchWithPK} from '../../../../services/database/Search';

import {columns, scanCodeFields} from './transfer-in-detail.config';

import get from 'lodash/get';
import values from 'lodash/values';
import isArray from 'lodash/isArray';
import findIndex from 'lodash/findIndex';
import moment from 'moment';

import styles from './TransferInDetail.style';
import {notificationService} from '../../../../services/notificationService';

const INITIAL_STATE = {
  list: [],
  loading: false,
  refreshing: false,
  isPortTrait: false,
  Hh_Doc: '',
  cellChanged: {
    idName: '',
    fieldName: 'Hh_Quantity1',
    idValue: '',
    selected: '',
  },
};

class TransferInDetail extends Component {
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
      transferDetail: {},
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
    this.getPartsOfTransferIn();
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
    const isQuickScan = scanType === FieldConstant.scan.QUICK_SCAN;
    const {t} = this.props;

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

  getPartsOfTransferIn = async () => {
    const transferInDetail = await this.getTransferIn();
    if (transferInDetail) {
      let parts = transferInDetail.NvStkHdToItm;
      // items object to array
      if (!isArray(parts)) {
        parts = values(parts);
      }
      this.setState({
        list: parts,
        Hh_Doc: transferInDetail.Hh_Doc,
        transferDetail: transferInDetail,
        fromUnfinished: transferInDetail.Hh_UnfinishedDoc,
      });
    }
  };

  getTransferIn = () => {
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
    this.getPartsOfTransferIn();
  };

  saveToSAP = async () => {
    // Get State
    let {list, Hh_Doc, transferDetail} = this.state;

    const isConnected = await isConnectedToTheNetwork();
    const token = await AsyncStorage.getItem(asyncStorageConst.TOKEN);

    if (!isConnected) {
      this.callMessage(MESSAGE.M010);
      return;
    }

    if (transferDetail) {
      const isEmptyQuantity = !!find(list, item => !item.Hh_Quantity1);

      if (isEmptyQuantity) {
        this.callMessage(MESSAGE.M001);
        return;
      }
      //
      let itemClone = await deepCopy(list),
        headerClone = await deepCopy(transferDetail);
      // Case: non login
      if (!token) {
        // Save offline
        update(tableConstant.name.DOC_HEADER, Hh_Doc, itemClone, headerClone)
          .then(() => this.goToLogin(headerClone.id))
          .catch(() => this.callMessage(MESSAGE.M017));
      } else {
        headerClone = mapDbToSAP(headerClone, itemClone);
        stockInService.saveTransferIn(headerClone).then(res => {
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
        detailPage: 'TransferInDetail',
      },
    });
  };

  excDeleteOffline = () => {
    // Get State
    const {fromUnfinished, transferDetail} = this.state;
    //
    if (!fromUnfinished) {
      // Refresh table
      this.getPartsOfTransferIn();
    } else {
      deleteRow(tableConstant.name.DOC_HEADER, transferDetail.id).then(() => {
        this.goToList();
      });
    }
  };

  deleteOffline = () => {
    this.callMessage(MESSAGE.M004);
  };

  saveOffline = async (notify, isTimeout) => {
    let {list, Hh_Doc, transferDetail} = this.state;
    // Clone data avoid out scope transaction from list
    let itemClone = await deepCopy(list),
      headerClone = await deepCopy(transferDetail);
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
    navigate(!fromUnfinished ? 'TransferInList' : 'UnfinishedDocumentList');
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
      fields,
      refreshing,
      cellChanged,
      isPortTrait,
      scanType,
      transferDetail,
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
                : {formatHhDoc(transferDetail.Hh_Doc)}
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
          <View style={[isPortTrait ? styles.viewDataDetails : '']}>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('HH Document')}: </Text>
              {formatHhDoc(transferDetail.Hh_Doc)}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Date')}: </Text>
              {moment(transferDetail.Sap_DocDate).format('DD.MM.YYYY')}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Unpacking (TRF) No.')}: </Text>
              {transferDetail.Sap_Doc}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Transfer Order No.')}: </Text>
              {transferDetail.Sap_Ref1}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Packing (TRF)')}: </Text>
              {transferDetail.Sap_Ref2}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Supplying Site')}: </Text>
              {transferDetail.Sap_Bp}
            </Text>
            <Text style={[isPortTrait ? styles.flexWidth : styles.autoWidth]}>
              <Text style={styles.labelBold}>{t('Site Name')}: </Text>
              {transferDetail.Sap_BpName}
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

export default withTranslation()(TransferInDetail);
