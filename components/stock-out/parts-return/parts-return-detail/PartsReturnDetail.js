import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';

import {Dimensions, PanResponder, BackHandler} from 'react-native';
import {Text, View, Button, Icon} from 'native-base';
import Toast from 'react-native-easy-toast';
import find from 'lodash/find';
import AsyncStorage from '@react-native-community/async-storage';
import {searchWithPK} from '../../../../services/database/Search';
import {
  FieldConstant,
  asyncStorageConst,
  dialogConstant,
} from '../../../../constants/constants';
import Field from '../../../shared/fields/field';
import EditableTable from '../../../shared/table/EditableTable';
import ActionButtons from '../../../shared/buttons/ActionButtons';

import {stockOutService} from '../../../../services/stockOutService';
import {
  deleteRow,
  update,
  deleteAfterSaveSAP,
} from '../../../../services/database/CRUD';

import {tableConstant} from '../../../../database/Constant';
import {
  PaginationConfiguration,
  NotificationType,
  buttonConstant,
  aMinute,
  inactivityTimeOut,
  maxValueQuantity,
  timingToastMsg,
} from '../../../../constants/constants';
import {MESSAGE} from '../../../../constants/message';

import {openMessageDialog} from '../../../../redux/message-dialog/MessageDialog.actions';

import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import values from 'lodash/values';
import isArray from 'lodash/isArray';

import {
  deepCopy,
  detectPortrait,
  onChangeInput,
  mapDbToSAP,
  isConnectedToTheNetwork,
} from '../../../../utils/functions';

import {
  columns,
  scanCodeFields,
  partDetail,
  recipientFields,
} from './parts-return-detail.config';

import Styles from './PartsReturnDetail.style';
import {notificationService} from '../../../../services/notificationService';

const INITIAL_STATE = {
  list: [],
  loading: false,
  refreshing: false,
  isPortTrait: false,
  cellChanged: {
    idName: '',
    fieldName: '',
    idValue: '',
    requested: '',
    rejected: '',
  },
};

class PartsReturnDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: PaginationConfiguration.itemsPerPage,
      page: PaginationConfiguration.currentPage,
      list: INITIAL_STATE.list,
      loading: INITIAL_STATE.list,
      refreshing: INITIAL_STATE.refreshing,
      fields: [...scanCodeFields],
      recipientField: [...recipientFields],
      isPortTrait: INITIAL_STATE.isPortTrait,
      //cellChanged is info item to focus the cell
      cellChanged: INITIAL_STATE.cellChanged,
      partReturnDetail: {},
      Hh_Doc: INITIAL_STATE.Hh_Doc,
      isHoneyWell: 'false',
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
    this.getItemsOfPartReturn();
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
    const {list, fields} = this.state;
    const {navigate} = this.props.navigation;
    const isQuickScan = scanType === FieldConstant.scan.QUICK_SCAN;
    const isRecipient = scanType === FieldConstant.scan.RECIPIENT;
    const {t} = this.props;
    const {isHoneyWell} = this.state;

    if (isRecipient) {
      let newFields = deepCopy(fields);
      newFields[0].value = value;
      this.setState({fields: newFields, cellChanged: {}});
      return;
    }

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
      this.toast.show(value);
      this.setState({list: newItems, cellChanged, scanType: scanType});
    } else {
      //handle part not found
      this.setState({cellChanged: {}});
      //[CR] - 15/09/2020 - Increase duration toast
      this.toast.show(t(MESSAGE.M005), timingToastMsg);
    }
    isQuickScan &&
      isHoneyWell === 'false' &&
      this.goScanScreen(navigate, scanType);
  };

  goScanScreen = (navigate, scanType) =>
    setTimeout(() => {
      navigate('CodeScan', {
        onGoBack: data => this.handleScanning({value: data, scanType}),
      });
    }, 1000);

  onCellChange = (value, field, rowData, scanType) => {
    const {list, cellChanged} = this.state;
    // if focusing cell which is different the cell scanned is out of scanning
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

  getItemsOfPartReturn = async () => {
    const partReturnDetail = await this.getPartReturn();
    if (partReturnDetail) {
      let parts = partReturnDetail.NvStkHdToItm;
      // items object to array
      if (!isArray(parts)) {
        parts = values(parts);
      }
      // Save Recipient field. This case exist in Stock-out and Return from Service screen
      this.onRecipientChange({
        target: {value: partReturnDetail.Hh_Recipient, name: 'Hh_Recipient'},
      });
      this.setState({
        list: parts,
        Hh_Doc: partReturnDetail.Hh_Doc,
        partReturnDetail: partReturnDetail,
        fromUnfinish: partReturnDetail.Hh_UnfinishedDoc,
      });
    }
  };

  getPartReturn = () => {
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
    this.getItemsOfPartReturn();
  };

  saveToSAP = async () => {
    let {Hh_Doc, list, partReturnDetail, recipientField} = this.state;

    const isConnected = await isConnectedToTheNetwork();
    const token = await AsyncStorage.getItem(asyncStorageConst.TOKEN);

    if (!isConnected) {
      this.callMessage(MESSAGE.M010);
      return;
    }

    if (this.isRecipientFieldEmpty()) {
      this.setState({isNotValidField: 'Recipient'}, () =>
        this.callMessage(MESSAGE.M001),
      );
      return;
    }

    if (partReturnDetail) {
      const isEmptyQuantity = !!find(list, item => !item.Hh_Quantity1);

      if (isEmptyQuantity) {
        this.setState({isNotValidField: 'Part Requested'}, () =>
          this.callMessage(MESSAGE.M001),
        );
        return;
      }

      const isEmptyRejected = !!find(list, item => !item.Hh_Quantity2);
      if (isEmptyRejected) {
        this.setState({isNotValidField: 'Part Rejected'}, () =>
          this.callMessage(MESSAGE.M001),
        );
        return;
      }
      //
      let itemClone = await deepCopy(list),
        headerClone = await deepCopy(partReturnDetail);
      // Save Recipient field. This case exist in Stock-out and Return from Service screen
      headerClone.Hh_Recipient = recipientField[0].value.toString().trim();

      // Case: non login
      if (!token) {
        // Save offline
        update(tableConstant.name.DOC_HEADER, Hh_Doc, itemClone, headerClone)
          .then(() => this.goToLogin(headerClone.id))
          .catch(() => this.callMessage(MESSAGE.M017));
      } else {
        // Save to SAP
        headerClone = await mapDbToSAP(headerClone, itemClone);
        stockOutService.savePartReturn(headerClone).then(res => {
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
        detailPage: 'PartsReturnDetail',
      },
    });
  };

  excDeleteOffline = () => {
    // Get State
    const {partReturnDetail, fromUnfinish} = this.state;

    if (!fromUnfinish) {
      // Refresh table
      this.getItemsOfPartReturn();
    } else {
      deleteRow(tableConstant.name.DOC_HEADER, partReturnDetail.id).then(() => {
        this.goToList();
      });
    }
  };

  deleteOffline = () => {
    this.callMessage(MESSAGE.M004);
  };

  saveOffline = async (notify, isTimeout) => {
    // Get State
    let {list, Hh_Doc, partReturnDetail, recipientField} = this.state;
    //
    let itemClone = await deepCopy(list),
      headerClone = await deepCopy(partReturnDetail);
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

  goToList = () => {
    const {fromUnfinish} = this.state;
    const {navigate} = this.props.navigation;
    navigate(!fromUnfinish ? 'PartsReturnList' : 'UnfinishedDocumentList');
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

  callMessage = message => {
    const {t} = this.props;
    let messObj;
    switch (message) {
      case MESSAGE.M001:
        const {isNotValidField} = this.state;
        messObj = {
          content: t(MESSAGE.M001, {fieldName: t(isNotValidField)}),
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
            fieldName: t('Part Requested'),
            fieldSize: '9',
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
      recipientField,
      cellChanged,
      isPortTrait,
      scanType,
      partReturnDetail,
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
              {partDetail.map((item, index) => {
                if (item.fieldName === 'Hh_Doc') {
                  return (
                    <Text style={Styles.textColor} key={index}>
                      : {item.format(partReturnDetail[item.fieldName])}
                    </Text>
                  );
                }
              })}
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
            {partDetail.map((item, index) => (
              <Text
                style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}
                key={index}>
                <Text style={Styles.labelBold}>{t(`${item.label}`)}: </Text>
                {item.format
                  ? item.format(partReturnDetail[item.fieldName])
                  : partReturnDetail[item.fieldName]}
              </Text>
            ))}
          </View>
        )}
        <View style={[isPortTrait ? Styles.flexRow : '']}>
          <View style={Styles.alignItems}>
            <Text style={Styles.textRecipient}>
              {t('Recipient')}
              <Text style={Styles.require}>*</Text>
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

export default withTranslation()(PartsReturnDetail);
