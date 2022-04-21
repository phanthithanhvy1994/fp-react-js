import {FieldConstant} from '../../../../constants/constants';
import {searchFieldStyle} from './StockCountRecountList.style';
import moment from 'moment';
import {formatHhDoc} from '../../../../utils/functions';

const searchField = onSearch => [
  {
    id: 'stockCount_search',
    fieldName: 'search',
    placeHolderText: 'Count Document No.',
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
    label: 'Count Document No.',
    fieldName: 'Sap_Doc',
    fieldType: FieldConstant.type.TEXT,
  },
];

// [#HONDAIPB-CR] - 26/06/2020 - Honda IT want the 1st column to be the one effected by Quick Search.
// C_RECOUNT => SAP_DOC should be the 1st column.
const columns = [
  {
    title: 'Count Document No.',
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

export {searchField, filterField, columns};
