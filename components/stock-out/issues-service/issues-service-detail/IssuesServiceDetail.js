import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';

import {Dimensions, PanResponder} from 'react-native';
import {Text, View, Button, Icon} from 'native-base';
import Toast from 'react-native-easy-toast';

import AsyncStorage from '@react-native-community/async-storage';
import find from 'lodash/find';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import values from 'lodash/values';
import isArray from 'lodash/isArray';

import EditableTable from '../../../shared/table/EditableTable';
import Field from '../../../shared/fields/field';
import ActionButtons from '../../../shared/buttons/ActionButtons';

import {stockOutService} from '../../../../services/stockOutService';
import {
  deleteRow,
  update,
  deleteAfterSaveSAP,
} from '../../../../services/database/CRUD';
import {searchWithPK} from '../../../../services/database/Search';

import {openMessageDialog} from '../../../../redux/message-dialog/MessageDialog.actions';

import {
  deepCopy,
  detectPortrait,
  onChangeInput,
  mapDbToSAP,
  isConnectedToTheNetwork,
} from '../../../../utils/functions';

import {tableConstant} from '../../../../database/Constant';

import {
  PaginationConfiguration,
  dialogConstant,
  FieldConstant,
  buttonConstant,
  asyncStorageConst,
  NotificationType,
  aMinute,
  inactivityTimeOut,
  maxValueQuantity,
  timingToastMsg,
} from '../../../../constants/constants';
import {MESSAGE} from '../../../../constants/message';

import {
  columns,
  scanCodeFields,
  itemDetail,
  recipientFields,
} from './issues-service-detail.config';

import Styles from './IssuesServiceDetail.style';
import {notificationService} from '../../../../services/notificationService';

const INITIAL_STATE = {
  list: [],
  loading: false,
  refreshing: false,
  isPortTrait: false,
  Hh_Doc: '',
  cellChanged: {
    idName: '',
    fieldName: '',
    idValue: '',
    picked: '',
    scanType: FieldConstant.scan.INIT,
  },
  isShowRecipient: false,
  fromUnfinished: false,
};

class IssuesServiceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: PaginationConfiguration.itemsPerPage,
      page: PaginationConfiguration.currentPage,
      list: INITIAL_STATE.list,
      loading: INITIAL_STATE.loading,
      refreshing: INITIAL_STATE.refreshing,
      fields: [...scanCodeFields],
      recipientField: [...recipientFields],
      isPortTrait: INITIAL_STATE.isPortTrait,
      cellChanged: INITIAL_STATE.cellChanged,
      messageDialog: '',
      Hh_Doc: INITIAL_STATE.Hh_Doc,
      isHoneyWell: 'false',
      issuesServiceDetail: {},
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
    this.getItemsOfIssuesService();
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
    const {isHoneyWell} = this.state;

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

      //create info item to focus the cell
      this.table && this.table.scrollToItem(partIndexFound);

      this.setState({
        list: newItems,
        cellChanged,
        scanType: scanType,
      });
      // Show Toast
      this.toast.show(value);
    } else {
      // handle part not found
      this.setState({cellChanged: {}});
      //[CR] - 15/09/2020 - Increase duration toast
      this.toast.show(t(MESSAGE.M005), timingToastMsg);
    }
    // Repeat to Scan screen
    if (scanType === FieldConstant.scan.QUICK_SCAN) {
      if (isHoneyWell === 'false') {
        setTimeout(() => {
          navigate('CodeScan', {
            onGoBack: data =>
              this.handleScanning({value: data, name, scanType}),
          });
        }, 1000);
      }
    }
  };

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
    newItems[partIndexFound].Hh_Quantity1 = '' + value;

    this.setState({
      list: newItems,
      cellChanged: newCellChanged,
      scanType: isOnScanning ? this.state.scanType : '',
    });
  };

  getItemsOfIssuesService = async () => {
    const issuesServiceDetail = await this.getIssuesService();

    if (issuesServiceDetail) {
      //
      if (issuesServiceDetail.Sap_Ref1Type === 'SERVICE') {
        // Save Recipient field. This case exist in Stock-out and Return from Service screen
        this.onRecipientChange({
          target: {
            value: issuesServiceDetail.Hh_Recipient,
            name: 'Hh_Recipient',
          },
        });
        this.setState({isShowRecipient: true});
      }
      //
      let items = get(issuesServiceDetail, 'NvStkHdToItm', []);
      // items object to array
      if (!isArray(items)) {
        items = values(items);
      }
      this.setState({
        list: items,
        Hh_Doc: issuesServiceDetail.Hh_Doc,
        issuesServiceDetail,
        fromUnfinished: issuesServiceDetail.Hh_UnfinishedDoc,
      });
    }
  };

  getIssuesService = () => {
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
    this.getItemsOfIssuesService();
  };

  saveToSAP = async () => {
    const {t} = this.props;
    let {Hh_Doc, list, issuesServiceDetail, recipientField} = this.state;

    const isConnected = await isConnectedToTheNetwork();
    const token = await AsyncStorage.getItem(asyncStorageConst.TOKEN);

    if (!isConnected) {
      this.callMessage(MESSAGE.M010);
      return;
    }
    if (
      this.isRecipientFieldEmpty() &&
      issuesServiceDetail.Sap_Ref1Type === 'SERVICE'
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

    if (issuesServiceDetail) {
      const isEmptyQuantity = !!find(list, item => !item.Hh_Quantity1);

      if (isEmptyQuantity) {
        this.callMessage(MESSAGE.M001);
        return;
      }
      //
      let itemClone = await deepCopy(list),
        headerClone = await deepCopy(issuesServiceDetail);
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
        headerClone = await mapDbToSAP(headerClone, itemClone);
        stockOutService.saveIssuesService(headerClone).then(res => {
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
        detailPage: 'IssuesServiceDetail',
      },
    });
  };

  excDeleteOffline = () => {
    // Get State
    const {issuesServiceDetail, fromUnfinished} = this.state;

    if (!fromUnfinished) {
      // Refresh table
      this.getItemsOfIssuesService();
    } else {
      deleteRow(tableConstant.name.DOC_HEADER, issuesServiceDetail.id).then(
        () => {
          this.goToList();
        },
      );
    }
  };

  deleteOffline = () => {
    this.callMessage(MESSAGE.M004);
  };

  saveOffline = async (notify, isTimeout) => {
    let {list, Hh_Doc, issuesServiceDetail, recipientField} = this.state;
    // Clone data avoid out scope transaction from list
    let itemClone = await deepCopy(list),
      headerClone = await deepCopy(issuesServiceDetail);
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
    navigate(!fromUnfinished ? 'IssuesServiceList' : 'UnfinishedDocumentList');
  };

  onRecipientChange = data => {
    const newInputFields = onChangeInput(recipientFields, data);
    this.setState({recipientField: newInputFields, cellChanged: {}});
  };

  handleActionButtons = actionName => {
    this.actions[actionName]();
  };

  callMessage = message => {
    const {t} = this.props;
    let messObj;
    switch (message) {
      case MESSAGE.M001:
        messObj = {
          content: t(MESSAGE.M001, {fieldName: t('Picked')}),
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
          content: t(MESSAGE.M008, {fieldName: t('Picked'), fieldSize: '9'}),
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
      issuesServiceDetail,
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
              {itemDetail.map((item, index) => {
                if (item.fieldName === 'Hh_Doc') {
                  return (
                    <Text style={Styles.textColor} key={index}>
                      : {item.format(issuesServiceDetail[item.fieldName])}
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
            {itemDetail.map((item, index) => (
              <Text
                style={[isPortTrait ? Styles.flexWidth : Styles.autoWidth]}
                key={index}>
                <Text style={Styles.labelBold}>{t(`${item.label}`)}: </Text>
                {item.format
                  ? item.format(issuesServiceDetail[item.fieldName])
                  : issuesServiceDetail[item.fieldName]}
              </Text>
            ))}
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

export default withTranslation()(IssuesServiceDetail);
