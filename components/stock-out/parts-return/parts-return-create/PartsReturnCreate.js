import React from 'react';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';

import {View, Dimensions, PanResponder} from 'react-native';

import Field from '../../../shared/fields/field';
import EditableTable from '../../../../components/shared/table/EditableTable';
import ActionButtons from '../../../shared/buttons/ActionButtons';

import get from 'lodash/get';
import map from 'lodash/map';
import values from 'lodash/values';
import isArray from 'lodash/isArray';
import findIndex from 'lodash/findIndex';
import moment from 'moment';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import {stockOutService} from '../../../../services/stockOutService';
import {notificationService} from '../../../../services/notificationService';

import {
  deleteRow,
  update,
  insert,
  deleteAfterSaveSAP,
} from '../../../../services/database/CRUD';
import {searchWithPK} from '../../../../services/database/Search';
import {openMessageDialog} from '../../../../redux/message-dialog/MessageDialog.actions';

import {
  deepCopy,
  onChangeInput,
  detectPortrait,
  formatDateSAP,
  isConnectedToTheNetwork,
  isEmptyField,
} from '../../../../utils/functions';

import {
  columns,
  scanCodeFields,
  partReturnFields,
} from './parts-return-create.config';

import {
  FieldConstant,
  asyncStorageConst,
  dialogConstant,
  INIT_CREATE,
  NotificationType,
  aMinute,
  inactivityTimeOut,
  maxValueQuantity,
} from '../../../../constants/constants';
import {tableConstant} from '../../../../database/Constant';
import {buttonConstant} from '../../../../constants/constants';
import {MESSAGE} from '../../../../constants/message';

import {Styles} from './PartsReturnCreate.style';

const INIT_STATE = {
  parts: [],
  detail: {},
  fieldStyles: {},
  scanFields: [...scanCodeFields],
  inputFields: [...partReturnFields],
  cellChanged: {
    idName: '',
    fieldName: '',
    idValue: '',
  },
  scanType: '',
  rowDeleting: '',
  inserted: false,
  isHoneyWell: 'false',
  isPortTrait: false,
  fromUnfinished: false,
  isAllRecordsDeleting: false,
  isRecipientFieldEmpty: true,
  Hh_Doc: tableConstant.Hh_Default,
};

class PartsReturnCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = INIT_STATE;
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
    this.getItemsOfPartsReturn();
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

  handleActionButtons = actionName => {
    this.actions[actionName]();
  };

  handleRefresh = () => {
    this.getItemsOfPartsReturn();
  };

  handleScanning = ({value, name, scanType}) => {
    const {parts, detail} = this.state;
    const {navigate} = this.props.navigation;
    const isQuickScan = scanType === FieldConstant.scan.QUICK_SCAN;
    const isEntryScan = scanType === FieldConstant.scan.ENTRY_SCAN;
    let existentParts = deepCopy(parts);
    const partIndexFound = findIndex(existentParts, ['Sap_Part', value]);
    let cellChanged = {};
    if (partIndexFound >= 0) {
      if (isQuickScan) {
        if (existentParts[partIndexFound].Hh_Quantity1 === maxValueQuantity) {
          this.callMessage(MESSAGE.M008);
          return;
        }
        existentParts[partIndexFound].Hh_Quantity1 = (
          Number(existentParts[partIndexFound].Hh_Quantity1) + 1
        ).toString();

        cellChanged = {
          idName: 'Sap_Part',
          idValue: value,
        };
      } else {
        cellChanged = {
          idName: 'Sap_Part',
          fieldName: 'Hh_Quantity1',
          idValue: value,
        };
      }

      this.table && this.table.scrollToItem(partIndexFound);
    } else {
      // Handle part not found
      // Create Doc_Item
      const docItem = (existentParts.length + 1).toString().padStart(6, 0),
        itemId = `${detail.id}#${docItem}`;
      const newPart = {
        Hh_DocItem: docItem,
        Sap_Part: value,
        Hh_Quantity1: isQuickScan ? '1' : '',
        id: itemId,
        Hh_Doc: detail.Hh_Doc,
      };
      existentParts.push(newPart);

      if (isQuickScan) {
        cellChanged = {
          idName: 'Sap_Part',
          idValue: value,
        };
      }
      if (isEntryScan) {
        cellChanged = {
          idName: 'Sap_Part',
          fieldName: 'Hh_Quantity1',
          idValue: value,
        };
      }
    }

    this.setState(
      {parts: existentParts, cellChanged, scanType: scanType},
      () => isQuickScan && this.goScanScreen(scanType, navigate),
    );
  };

  onCellChange = (value, field, rowData) => {
    const {parts, cellChanged} = this.state;
    const isOnScanning = cellChanged.idValue === rowData.Sap_Part;

    // Event focus cell
    if (!field) {
      this.setState({
        cellChanged: {
          idName: 'Sap_Part',
          idValue: rowData.Sap_Part,
        },
        scanType: isOnScanning ? this.state.scanType : '',
      });
      return;
    }

    let newItems = deepCopy(parts);
    const partIndexFound = findIndex(newItems, ['Sap_Part', rowData.Sap_Part]);
    newItems[partIndexFound].Hh_Quantity1 = '' + value;
    this.setState({
      parts: newItems,
      cellChanged: {
        idName: 'Sap_Part',
        idValue: rowData.Sap_Part,
      },
      scanType: isOnScanning ? this.state.scanType : '',
    });
  };

  inputFieldChange = data => {
    const {inputFields} = this.state;
    const newInputFields = onChangeInput(inputFields, data);
    this.setState({inputFields: newInputFields, cellChanged: {}});
  };

  getItemsOfPartsReturn = async () => {
    let partsReturn = await this.getPartsReturn();
    const fromListPart = !partsReturn;
    let parts;

    if (fromListPart) {
      const id = new Date().getTime().toString();
      partsReturn = INIT_CREATE;
      partsReturn.id = id;
      partsReturn.Hh_Doc = id;
      partsReturn.Hh_UnfinishedDoc = true;
      partsReturn.Trx_Type = tableConstant.trx_type.PARTS_RETURN;
      partsReturn.Hh_Subtitle = tableConstant.subtitle.PATH_RETURN_CREATE;
      parts = [];
    } else {
      // Display Ref. Receipt
      let e = {target: {value: partsReturn.Sap_Doc, name: 'refReceipt'}};
      this.inputFieldChange(e);
      // Display Ref. Receipt Year
      e.target = {value: partsReturn.Sap_DocYear, name: 'refReceiptYear'};
      this.inputFieldChange(e);
      // Display Request No.
      e.target = {value: partsReturn.Hh_Ref1, name: 'requestNo'};
      this.inputFieldChange(e);
      // Display Request No.
      e.target = {
        value: moment(formatDateSAP(partsReturn.Hh_CreateDate)).format(
          'DD.MM.YYYY',
        ),
        name: 'date',
      };
      this.inputFieldChange(e);
      // Display Recipient
      // [#HONDAIPB-FixBug] - 23/06/2020 - Show correct fieldName in {th} required message
      e.target = {value: partsReturn.Hh_Recipient, name: 'Recipient'};
      this.inputFieldChange(e);
      parts = partsReturn.NvStkHdToItm;
    }

    // items object to array
    if (!isArray(parts)) {
      parts = values(parts);
    }
    //
    this.setState({
      parts: parts,
      Hh_Doc: partsReturn.Hh_Doc,
      detail: partsReturn,
      fromUnfinished: !fromListPart,
    });
  };

  getPartsReturn = () => {
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

  deleteRow = () => {
    const {parts, rowDeleting} = this.state;
    let isItemRenewSapDocItem = false;
    const newList = reduce(
      parts,
      (result, item) => {
        if (isItemRenewSapDocItem) {
          item.Hh_DocItem = +item.Hh_DocItem - 1;
        }
        if (item.Sap_Part === rowDeleting.Sap_Part) {
          isItemRenewSapDocItem = true;
          return result;
        }
        result.push(item);
        return result;
      },
      [],
    );
    this.setState({parts: newList, rowDeleting: ''});
  };

  excDeleteOffline = () => {
    // Get State
    const {fromUnfinished, detail} = this.state;
    // Get Props
    //
    if (!fromUnfinished) {
      // Refresh table + field
      this.getItemsOfPartsReturn();
    } else {
      deleteRow(tableConstant.name.DOC_HEADER, detail.id).then(() => {
        this.goToList();
      });
    }
  };

  deleteOffline = () => {
    this.setState(
      {
        isAllRecordsDeleting: true,
      },
      () => this.callMessage(MESSAGE.M004),
    );
  };

  saveOffline = async (notify, isTimeout) => {
    let {
      parts,
      detail,
      Hh_Doc,
      inserted,
      inputFields,
      fromUnfinished,
    } = this.state;

    // Prepare update/create Obj
    const fields = inputFields;
    let itemClone = await deepCopy(parts),
      headerClone = await deepCopy(detail);
    headerClone.id = `1#${headerClone.Hh_Doc}`;
    headerClone.Sap_Doc = fields[0].value.toString();
    headerClone.Sap_DocYear = fields[1].value.toString();
    headerClone.Hh_Ref1 = fields[2].value.toString();
    headerClone.Hh_Recipient = fields[4].value.toString();
    headerClone.Hh_CreateDate = new Date().getTime();
    map(itemClone, item => {
      item.Trx_Type = tableConstant.trx_type.PARTS_RETURN;
      return item;
    });
    headerClone.NvStkHdToItm = itemClone;

    if (fromUnfinished || inserted) {
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
    } else {
      // Save to DB
      insert(tableConstant.name.DOC_HEADER, headerClone)
        .then(() => {
          if (isTimeout) {
            return;
          }
          if (notify) {
            if (notify === NotificationType.IS_NAVIGATING_BACK) {
              this.goToList();
            } else {
              // Avoid case re-insert same header after notify background
              this.setState({inserted: true});
              return;
            }
          } else {
            this.callMessage(MESSAGE.M003);
          }
        })
        .catch(() => this.callMessage(MESSAGE.M017));
    }
  };

  saveToSAP = async () => {
    let {parts, Hh_Doc, detail, inputFields} = this.state;

    const isConnected = await isConnectedToTheNetwork();
    const token = await AsyncStorage.getItem(asyncStorageConst.TOKEN);

    if (!isConnected) {
      this.callMessage(MESSAGE.M010);
      return;
    }

    const isEmptyQuantity = !!find(parts, item => !item.Hh_Quantity1);

    if (isEmptyQuantity) {
      this.setState({isNotValidField: 'Part Create Requested'}, () =>
        this.callMessage(MESSAGE.M001),
      );
      return;
    }

    // Clone Obj
    let itemClone = await deepCopy(parts),
      headerClone = await deepCopy(detail);
    const fields = inputFields;

    // Case: non login
    if (!token) {
      // Save offline
      // Prepare update/create Obj
      headerClone.id = `1#${headerClone.Hh_Doc}`;
      headerClone.Sap_Doc = fields[0].value.toString();
      headerClone.Sap_DocYear = fields[1].value.toString();
      headerClone.Hh_Ref1 = fields[2].value.toString();
      headerClone.Hh_Recipient = fields[4].value.toString();
      headerClone.Hh_CreateDate = new Date().getTime();
      map(itemClone, item => {
        item.Trx_Type = tableConstant.trx_type.PARTS_RETURN;
        return item;
      });
      headerClone.NvStkHdToItm = itemClone;
      update(tableConstant.name.DOC_HEADER, Hh_Doc, itemClone, headerClone)
        .then(data => this.goToLogin(data))
        .catch(() => this.callMessage(MESSAGE.M017));
      return;
    }

    // Check part exist
    if (itemClone.length === 0) {
      this.callMessage(MESSAGE.M018);
      return;
    }

    // Check required field
    let notEmptyField = isEmptyField(inputFields);
    if (notEmptyField !== '') {
      this.setState({isNotValidField: notEmptyField}, () =>
        this.callMessage(MESSAGE.M001),
      );
      return;
    }

    // Create Obj param to request SAP
    const partsReturn = {};
    partsReturn.Hh_Doc = tableConstant.Hh_Default;
    // [#HONDAIPB-CR] - 22/06/2020 - Trim data before Save to SAP
    partsReturn.Sap_Doc = fields[0].value.toString().trim();
    partsReturn.Sap_DocYear = fields[1].value.toString();
    partsReturn.Hh_Ref1 = fields[2].value.toString().trim();
    partsReturn.Hh_Recipient = fields[4].value.toString().trim();
    headerClone.Hh_CreateDate = formatDateSAP(new Date().getTime());
    partsReturn.Trx_Type = tableConstant.trx_type.PARTS_RETURN;
    partsReturn.NvStkHdToRet = [{}];
    map(itemClone, item => {
      item.Hh_Doc = tableConstant.Hh_Default;
      delete item.id;
      delete item.Trx_Type;
    });
    partsReturn.NvStkHdToItm = itemClone;
    //
    stockOutService.createPartsReturn(partsReturn).then(res => {
      const mess = get(res, 'd.NvStkHdToRet.results[0].Message', '');
      if (mess.length > 0) {
        deleteAfterSaveSAP(tableConstant.name.DOC_HEADER, Hh_Doc)
          .then(() => this.callMessage(mess))
          .catch(() => this.callMessage(MESSAGE.M017));
      }
    });
  };

  goToList = () => {
    const {fromUnfinished} = this.state;
    const {state, navigate, push} = this.props.navigation;

    if (state.params && fromUnfinished) {
      state.params.onGoBack && state.params.onGoBack();
      navigate('UnfinishedDocumentList');
    } else {
      navigate('PartsReturnList');
    }
  };

  goToLogin = header => {
    const {navigate} = this.props.navigation;
    navigate('Login', {
      data: {
        headerId: header.id,
        detailPage: 'PartsReturnCreate',
      },
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

  openDialogRowDeleting = rowData => {
    this.setState(
      {
        isAllRecordsDeleting: false,
        rowDeleting: rowData,
        cellChanged: {},
      },
      this.callMessage(MESSAGE.M004),
    );
  };

  callMessage = message => {
    const {t} = this.props;
    const {isAllRecordsDeleting, isNotValidField} = this.state;

    let messObj;
    switch (message) {
      case MESSAGE.M001:
        messObj = {
          content: t(message, {fieldName: t(isNotValidField)}),
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
          content: t(message),
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
          content: t(message),
          buttons: [
            {
              name: buttonConstant.BUTTON_CANCEL,
              type: dialogConstant.button.NONE_FUNCTION,
            },
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.FUNCTION,
              action: () => {
                if (isAllRecordsDeleting) {
                  this.excDeleteOffline();
                } else {
                  this.deleteRow();
                }
              },
            },
          ],
        };
        break;
      case MESSAGE.M008:
        messObj = {
          content: t(message, {
            fieldName: t('Part Create Requested'),
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
      case MESSAGE.M018:
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

  render() {
    const {
      parts,
      scanFields,
      cellChanged,
      isPortTrait,
      inputFields,
    } = this.state;
    const {navigation} = this.props;

    return (
      <View style={Styles.container} {...this.eventActiveInScreen.panHandlers}>
        <Field
          conditionalArray={inputFields}
          onChange={this.inputFieldChange}
          isPortTrait={true}
          navigation={navigation}
        />

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
            values={parts}
            onCellChange={(value, field, rowData) => {
              this.onCellChange(value, field, rowData);
            }}
            cellChanged={cellChanged}
            onDeleteRow={rowData => this.openDialogRowDeleting(rowData)}
          />
        </View>
        <View style={[Styles.fixedFooter, isPortTrait ? Styles.flexRow : '']}>
          <View style={[isPortTrait ? Styles.scanning : '']}>
            <Field
              conditionalArray={scanFields}
              onChange={this.handleScanning}
              navigation={navigation}
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

export default withTranslation()(PartsReturnCreate);
