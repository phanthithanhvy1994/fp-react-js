import React from 'react';
import {Dimensions} from 'react-native';

import get from 'lodash/get';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';
import endsWith from 'lodash/endsWith';

import RootSiblings from 'react-native-root-siblings';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';

import DialogSAP from '../components/shared/dialog/DialogSAP';

import {tableConstant} from '../database/Constant';

const onChangeDateFromTo = (targetUpdate, name, updateVal) => {
  // Get index case Range Input
  const targetInd = targetUpdate.findIndex(
    field =>
      // eslint-disable-next-line no-prototype-builtins
      (field.hasOwnProperty('from') && field.from.fieldName === name) ||
      (field.hasOwnProperty('to') && field.to.fieldName === name),
  );
  // Check component change value & update value
  if (targetUpdate[targetInd].from.fieldName === name) {
    targetUpdate[targetInd].from.value = updateVal;
  } else {
    targetUpdate[targetInd].to.value = updateVal;
  }
  return targetUpdate;
};

export const onChangeInput = (fieldArray, event) => {
  const {value, name} = event.target;
  // Clone field array
  let targetUpdate = JSON.parse(JSON.stringify(fieldArray));
  if (fieldArray[0].btnOnPress) {
    targetUpdate = fieldArray;
  }
  // Determine typeof value to update
  // If value = null, do not update value
  // eslint-disable-next-line no-prototype-builtins
  const updateVal = value && (value.hasOwnProperty('key') ? value.key : value);
  // Get index of target
  const targetInd = targetUpdate.findIndex(field => field.fieldName === name);
  // Update value with case Date from to
  if (targetInd === -1) {
    targetUpdate = onChangeDateFromTo(targetUpdate, name, updateVal);
    return targetUpdate;
  }
  // Update value if exist
  if (targetInd !== -1) {
    targetUpdate[targetInd].value = updateVal;
  }
  return targetUpdate;
};

// create a copy data to avoid change the initial data
export const deepCopy = data => JSON.parse(JSON.stringify(data));

export const getStateFields = fieldArray => {
  const stateFields = fieldArray.reduce((mapping, obj) => {
    if (get(obj, 'from.value', false) || get(obj, 'to.value', false)) {
      mapping[obj.fieldName] = {from: obj.from.value, to: obj.to.value};
      return mapping;
    }
    mapping[obj.fieldName] = obj.value;
    return mapping;
  }, {});
  return stateFields;
};

export const detectPortrait = (screenWidth, screenHeight) => {
  if (!screenWidth) {
    screenWidth = Dimensions.get('window').width;
    screenHeight = Dimensions.get('window').height;
  }
  let isPortrait = false;
  if (screenHeight < screenWidth) {
    isPortrait = true;
  }
  return isPortrait;
};

export const getFirstDayOfMonth = () => {
  return moment().startOf('month');
};

export const getLastDayOfMonth = () => {
  return moment().endOf('month');
};

export const replaceDateProp = props => {
  if (props) {
    // [HONDAIPB-Updated] - 23/06/2020 - Avoid props.match(/\d+/) return null => forever loading
    let convertArr = props.match(/\d+/);
    let convertJsonDate = convertArr && convertArr[0];
    if (convertJsonDate) {
      props = parseInt(convertJsonDate, 10);
    } else {
      props = 0;
    }
  }
  if (props === null || props === undefined || typeof props === 'string') {
    props = 0;
  }
  return props;
};

export const mapSearchObj = (searchObj, defaultObj) => {
  for (const key in defaultObj) {
    if (searchObj.hasOwnProperty(key)) {
      defaultObj[key] = searchObj[key];
    }
  }
  return defaultObj;
};

export const parseDataFromFilter = filterData => {
  let {Sap_DocDate} = filterData;
  if (!filterData.Sap_DocDate) {
    filterData.Sap_DocDate = {
      from: getFirstDayOfMonth().valueOf(),
      to: getLastDayOfMonth().valueOf(),
    };
  } else {
    for (const key in Sap_DocDate) {
      Sap_DocDate[key] = new Date(Sap_DocDate[key]).getTime();
    }
  }
  //Remove unused by CR changed
  //filterData.Sap_DocYear = (filterData.Sap_DocYear || '').toString();

  return filterData;
};

export const convertObjToArray = obj => {
  let list = [];
  for (const key in obj) {
    list.push(obj[key]);
  }
  return list;
};

export const swapItemFromSAP = items => {
  // temp variables use to remove results props
  let tmpItemDetails = [];
  for (const key in items) {
    let item = items[key];
    // Remove not save props
    delete item.__metadata;
    delete item.NvStkHdToRet;
    // Map data
    for (const props in item) {
      switch (props) {
        // DB field type int
        case 'Sap_DocDate':
        case 'Sap_PostingDate':
        case 'Hh_ChangeDate':
        case 'Hh_CreateDate':
          if (item[props]) {
            // Format Json date to milliseconds
            item[props] = replaceDateProp(item[props]);
          } else {
            item[props] = 0;
          }
          break;
        // Special case
        case 'NvStkHdToItm':
          tmpItemDetails = item[props].results;
          // Remove results
          item[props] = tmpItemDetails;
          break;
        default:
          // DB field type string
          if (!item[props]) {
            item[props] = '';
          }
          break;
      }
    }

    // Header Id
    item.id = `${item.Hh_Doc}`;

    // Doc_Item
    // Add auto increment to Item
    for (let i = 0; i < tmpItemDetails.length; i++) {
      let detail = item.NvStkHdToItm[i];
      detail.id = `${item.id}#${detail.Hh_DocItem}`;
      detail.Trx_Type = item.Trx_Type;
      //
      delete detail.__metadata;
      // Check case data type incorrect
      for (const j in detail) {
        switch (j) {
          // SAP res null w String in DB
          case 'Hh_ChangeDate':
          case 'Hh_CreateDate':
            if (detail[j] === null) {
              detail[j] = formatDateSAP(0);
            }
            break;
          default:
            // DB field type string
            if (!detail[j]) {
              detail[j] = '';
            }
            break;
        }
      }
    }
  }
};

export const getListYear = () => {
  const year = new Date().getFullYear(); //Current Year
  let listYear = [
    // [#HONDAIPB-CR] - 22/06/2020 - Remove Current Year + 1
    {display: `${year}`, value: `${year}`},
    {display: `${year - 1}`, value: `${year - 1}`},
  ];
  return listYear;
};

export const formatDateSAP = value => {
  return `/Date(${value})/`;
};

export const mapDbToSAP = (data, items) => {
  data.NvStkHdToRet = [{}];
  if (data.Sap_DocDate >= 0) {
    data.Sap_DocDate = formatDateSAP(data.Sap_DocDate);
  }
  if (data.Sap_PostingDate >= 0) {
    data.Sap_PostingDate = formatDateSAP(data.Sap_PostingDate);
  }
  if (data.Hh_ChangeDate >= 0) {
    data.Hh_ChangeDate = formatDateSAP(data.Hh_ChangeDate);
  }
  if (data.Hh_CreateDate >= 0) {
    data.Hh_CreateDate = formatDateSAP(data.Hh_CreateDate);
  }
  const newItems = map(deepCopy(items), item => {
    if (item.Sap_CheckBox) {
      item.Hh_CheckBox = item.Sap_CheckBox;
    }
    if (item.Sap_Unit) {
      item.Hh_Unit = item.Sap_Unit;
    }
    delete item.id;
    delete item.Trx_Type;
    delete item.__metadata;
    return item;
  });

  data.NvStkHdToItm = newItems;
  delete data.id;
  delete data.Hh_Subtitle;
  delete data.Hh_UnfinishedDoc;
  delete data.__metadata;

  return data;
};

// Save Offline
export const mapSaveItemsId = (items, headerId) => {
  for (const key in items) {
    if (items[key].hasOwnProperty('id')) {
      items[key].id = `${headerId}#${items[key].Hh_DocItem}`;
    }
  }
};

export const formatInputQuantity = value => {
  value = !value ? '' : Number(value);
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const showDialog = config => {
  return new RootSiblings(<DialogSAP config={config} />);
};

export const trimContent = value => {
  return value.replace(/^[ ]+|[ ]+$/g, '');
};

export const isConnectedToTheNetwork = async () => {
  let isConnected = false;

  await NetInfo.fetch().then(state => {
    isConnected = state.isConnected;
  });

  return isConnected;
};

export const formatHhDoc = Hh_Doc => {
  if (!Hh_Doc) {
    return;
  }
  if (Hh_Doc.startsWith('T')) {
    return '';
  }
  return Hh_Doc;
};

// [HONDAIPB-CR] - 26/06/2020 - Change the Quick Search of I_PURCHASE from SAP_DOC to SAP_REF1
// Additional new function
const qryBuilder = (transactionType, opr, data) => {
  let queryString = '';

  if (typeof opr === 'object') {
    // Search begin & end case
    let qryData = data.split('*');
    let lastIndex = qryData.length - 1,
      firstIndex = 0;
    switch (transactionType) {
      case tableConstant.trx_type.RECEIVE_PURCHASE:
        queryString = `Trx_Type == "${transactionType}" && Sap_Ref1 ${
          opr.begin
        } "${qryData[firstIndex]}" && Sap_Ref1 ${opr.end} "${
          qryData[lastIndex]
        }" && Hh_UnfinishedDoc == false`;
        break;
      default:
        queryString = `Trx_Type == "${transactionType}" && Sap_Doc ${
          opr.begin
        } "${qryData[firstIndex]}" && Sap_Doc ${opr.end} "${
          qryData[lastIndex]
        }" && Hh_UnfinishedDoc == false`;
        break;
    }
  } else {
    // Normal case
    let qryData = data.replace(/\*/g, '');
    switch (transactionType) {
      case tableConstant.trx_type.RECEIVE_PURCHASE:
        queryString = `Trx_Type == "${transactionType}" && Sap_Ref1 ${opr} "${qryData}" && Hh_UnfinishedDoc == false`;
        break;
      default:
        queryString = `Trx_Type == "${transactionType}" && Sap_Doc ${opr} "${qryData}" && Hh_UnfinishedDoc == false`;
        break;
    }
  }

  return queryString;
};

export const createQuickSearchQry = (transactionType, data) => {
  let opr;
  let regexValue = (data || '').replace(/(?:\*)+/g, '*');
  const numberOfStar = (regexValue.match(/\*/g) || []).length;

  // [#HONDAIPB-CR] - 13/07/2020 - Add Case-Insensitive
  switch (numberOfStar) {
    case 0:
      if (data.length === 0) {
        opr = 'CONTAINS[c]';
      } else {
        opr = '==[c]';
      }
      break;
    case 1:
      if (data.length === 1) {
        opr = 'CONTAINS[c]';
      } else {
        if (startsWith(data, '*')) {
          opr = 'ENDSWITH[c]';
        }
        if (endsWith(data, '*')) {
          opr = 'BEGINSWITH[c]';
        }
        if (!startsWith(data, '*') && !endsWith(data, '*')) {
          opr = {
            begin: 'BEGINSWITH[c]',
            end: 'ENDSWITH[c]',
          };
        }
      }
      break;
    default:
      // Case >= 2
      // Star only end
      if (!startsWith(data, '*') && endsWith(data, '*')) {
        opr = 'BEGINSWITH[c]';
      }
      // Star only start
      if (startsWith(data, '*') && !endsWith(data, '*')) {
        opr = 'ENDSWITH[c]';
      }
      // Star start & end
      if (!startsWith(data, '*') && !endsWith(data, '*')) {
        opr = {
          begin: 'BEGINSWITH[c]',
          end: 'ENDSWITH[c]',
        };
      }
      break;
  }

  // If don't map any case
  if (!opr) {
    opr = 'CONTAINS[c]';
  }
  // Build query string
  let queryString = qryBuilder(transactionType, opr, data);

  return queryString;
};

export const isInitialFilter = filterData => {
  if (Object.keys(filterData).length === 0) {
    return true;
  }

  const dateFrom =
    get(filterData, 'Sap_DocDate.from', false) ||
    get(filterData, 'Hh_CreateDate.from', false);
  const dateTo =
    get(filterData, 'Sap_DocDate.to', false) ||
    get(filterData, 'Hh_CreateDate.to', false);
  const dayOfPrevMonth = new Date().setDate(new Date().getDate() - 30);
  const filterDateFrom = new Date(dateFrom).getTime();
  const dayOfCurrentMonth = new Date().setDate(new Date().getDate());
  const filterDateTo = new Date(dateTo).getTime();

  return (
    Object.keys(filterData).length === 1 &&
    moment(dayOfPrevMonth).isSame(filterDateFrom, 'day') &&
    moment(dayOfCurrentMonth).isSame(filterDateTo, 'day')
  );
};

// This function customize for #3001
//[#HONDAIPB-FixBug] - 23/06/2020 - Show correct fieldName in {th} required message
export const isEmptyField = field => {
  for (const key in field) {
    if (field[key].id === 'recipientFields' && !field[key].value) {
      return field[key].label;
    }
    if (field[key].id === 'refReceipt' && !field[key].value) {
      return field[key].label;
    }
  }
  return '';
};
