import {FieldConstant} from '../../../../constants/constants';
import {searchFieldStyle} from './PartsReturnList.style';
import moment from 'moment';
import {formatHhDoc} from '../../../../utils/functions';

const searchField = onSearch => [
  {
    id: 'partReturn_search',
    fieldName: 'Sap_Doc',
    placeHolderText: 'Ref. Receipt',
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
    id: 'Hh_CreateDate',
    fieldName: 'Hh_CreateDate',
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
    id: 'Sap_RequestNo',
    label: 'Request No.',
    fieldName: 'Hh_Ref1',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'Sap_RefReceipt',
    label: 'Ref. Receipt',
    fieldName: 'Sap_Doc',
    fieldType: FieldConstant.type.TEXT,
  },
];
const columns = [
  {
    title: 'HH Document',
    field: 'Hh_Doc',
    format: value => formatHhDoc(value),
  },
  {
    title: 'Document Date',
    field: 'Hh_CreateDate',
    format: value => moment(value).format('DD.MM.YYYY'),
  },
  {
    title: 'Request No.',
    field: 'Hh_Ref1',
  },
  {
    title: 'Ref. Receipt',
    field: 'Sap_Doc',
  },
];
export {searchField, filterField, columns};
