import {FieldConstant} from '../../../../constants/constants';
import {searchFieldStyle} from './ReceivingPurchaseList.style';
import moment from 'moment';
import {formatHhDoc} from '../../../../utils/functions';
import numeral from 'numeral';

// [#HONDAIPB-CR] - 26/06/2020 - Honda IT want the 1st column to be the one effected by Quick Search.
// I_PURCHASE => SAP_REF1 should be the 1st column.
const columns = [
  {
    title: 'Tax Invoice No.',
    field: 'Sap_Ref1',
  },
  {
    title: 'HH Document',
    field: 'Hh_Doc',
    format: value => formatHhDoc(value),
  },
  {
    title: 'Date',
    field: 'Sap_DocDate',
    format: value => moment(value).format('DD.MM.YYYY'),
  },
  {
    title: 'Invoice No.',
    field: 'Sap_Doc',
    width: 110,
  },
  {
    title: 'Unpacking No.',
    field: 'Sap_Ref2',
  },
  {
    title: 'Vendor',
    field: 'Sap_Bp',
  },

  {
    title: 'Currency',
    field: 'Sap_Currency',
  },
  {
    title: 'Net Price',
    field: 'Sap_Netprice',
    type: 'numeric',
    format: value => numeral(value).format('0,0.00'),
  },
  {
    title: 'VAT',
    field: 'Sap_TaxAmount',
    type: 'numeric',
    format: value => numeral(value).format('0,0.00'),
  },
  {
    title: 'Gross Price',
    field: 'Sap_AmountIncVat',
    type: 'numeric',
    format: value => numeral(value).format('0,0.00'),
  },
  {
    title: 'Vendor Name',
    field: 'Sap_BpName',
    type: 'text',
  },
];

const searchField = onSearch => [
  {
    id: 'receiveFromPurchasing_search',
    fieldName: 'search',
    placeHolderText: 'Tax Invoice No.',
    fieldType: FieldConstant.type.TEXT,
    hasButton: true,
    customStyle: searchFieldStyle,
    value: '',
    btnOnPress: () => onSearch(),
  },
];

const filterField = [
  {
    id: 'Hh_Doc',
    label: 'HH Document',
    fieldName: 'Hh_Doc',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Checkbox',
    label: 'Only documents that have not been saved',
    fieldName: 'withoutHhDoc',
    fieldType: FieldConstant.type.CHECKBOX,
  },
  {
    id: 'Sap_DocDate',
    fieldName: 'Sap_DocDate',
    fieldType: FieldConstant.type.DATE_FROM_TO,
    from: {
      label: 'DateFrom',
      id: 'Sap_DocDate_From',
      fieldName: 'Sap_DocDate_From',
      value: '',
      placeHolderText: 'Choose Date',
    },
    to: {
      label: 'DateTo',
      id: 'Sap_DocDate_To',
      fieldName: 'Sap_DocDate_To',
      value: '',
      placeHolderText: 'Choose Date',
    },
  },
  {
    id: 'Sap_Doc',
    label: 'Invoice No.',
    fieldName: 'Sap_Doc',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Sap_Ref1',
    label: 'Tax Invoice No.',
    fieldName: 'Sap_Ref1',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Sap_Ref2',
    label: 'Unpacking No.',
    fieldName: 'Sap_Ref2',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Sap_Bp',
    label: 'Vendor',
    fieldName: 'Sap_Bp',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Sap_BpName',
    label: 'Vendor Name',
    fieldName: 'Sap_BpName',
    fieldType: FieldConstant.type.TEXT,
  },
];

const databaseDefine = {
  TRX_TYPE: {RECEIVING_PURCHASING: 'I_PURCHASE'},
};

export {searchField, filterField, columns, databaseDefine};
