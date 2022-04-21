import {FieldConstant} from '../../../../constants/constants';
import {searchFieldStyle} from './ReturnServiceList.style';
import {formatHhDoc} from '../../../../utils/functions';
import moment from 'moment';

// [#HONDAIPB-CR] - 26/06/2020 - Honda IT want the 1st column to be the one effected by Quick Search.
// I_SALESRETURN => SAP_DOC should be the 1st column.
const columns = [
  {
    title: 'Return No.',
    field: 'Sap_Doc',
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
    width: 100,
  },
  {
    title: 'Order No.',
    field: 'Sap_Ref1',
  },
  {
    title: 'Invoice No.',
    field: 'Sap_Ref2',
  },
  {
    title: 'Ref. Packing',
    field: 'Sap_Ref3',
  },
  {
    title: 'Customer',
    field: 'Sap_Bp',
  },
  {
    title: 'Customer Name',
    field: 'Sap_BpName',
    type: 'text',
  },
];

const searchField = onSearch => [
  {
    id: 'returnService_search',
    fieldName: 'search',
    placeHolderText: 'Return No.',
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
    label: 'Return No.',
    fieldName: 'Sap_Doc',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Sap_Ref1',
    label: 'Order No.',
    fieldName: 'Sap_Ref1',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Sap_Ref2',
    label: 'Invoice No.',
    fieldName: 'Sap_Ref2',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Sap_Ref3',
    label: 'Ref. Packing',
    fieldName: 'Sap_Ref3',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Sap_Bp',
    label: 'Customer',
    fieldName: 'Sap_Bp',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Sap_BpName',
    label: 'Customer Name',
    fieldName: 'Sap_BpName',
    fieldType: FieldConstant.type.TEXT,
  },
];

export {searchField, filterField, columns};
