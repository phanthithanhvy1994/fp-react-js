import {FieldConstant} from '../../../../constants/constants';
import {searchFieldStyle} from './RandomStockCountList.style';
import moment from 'moment';
import {formatHhDoc} from '../../../../utils/functions';

// [#HONDAIPB-CR] - 26/06/2020 - Honda IT want the 1st column to be the one effected by Quick Search.
// C_RANDOM => SAP_DOC should be the 1st column.
const columns = [
  {
    title: 'Random Count No.',
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
  },
];

const searchField = onSearch => [
  {
    id: 'randomStockCount_search',
    fieldName: 'search',
    placeHolderText: 'Random Count No.',
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
    label: 'Random Count No.',
    fieldName: 'Sap_Doc',
    fieldType: FieldConstant.type.TEXT,
  },
];

export {searchField, filterField, columns};
