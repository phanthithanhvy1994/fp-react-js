import {FieldConstant} from '../../../../constants/constants';
import {formatInputQuantity, formatHhDoc} from '../../../../utils/functions';
import moment from 'moment';

const columns = [
  {
    title: '#',
    field: 'Sap_DocItem',
  },
  {
    title: 'Part No',
    field: 'Sap_Part',
  },
  {
    title: 'Part Name',
    field: 'Sap_Partname',
    type: 'text',
  },
  {
    title: 'Part Requested',
    field: 'Hh_Quantity1',
    type: 'numeric',
    editable: true,
    format: value => formatInputQuantity(value),
    maxLength: 11,
  },
  {
    title: 'Part Rejected',
    field: 'Hh_Quantity2',
    type: 'numeric',
    editable: true,
    format: value => formatInputQuantity(value),
    maxLength: 11,
  },
];

const scanCodeFields = [
  {
    id: 'id1',
    fieldName: 'scan',
    iconName: 'qrcode-scan',
    placeHolderText: {
      QUICK_SCAN: 'Quick Scan',
      ENTRY_SCAN: 'Entry Scan',
    },
    fieldType: FieldConstant.type.SCAN,
  },
];

const recipientFields = [
  {
    id: 'recipientFields',
    fieldName: 'Hh_Recipient',
    iconName: 'qrcode-scan',
    placeHolderText: 'Please input Recipient No. or scan it',
    fieldType: FieldConstant.type.RECIPIENT,
    value: '',
  },
];

const partDetail = [
  {
    label: 'HH Document',
    fieldName: 'Hh_Doc',
    format: value => formatHhDoc(value),
  },
  {
    label: 'Date',
    fieldName: 'Hh_CreateDate',
    format: value => moment(value).format('DD.MM.YYYY'),
  },
  {label: 'Ref. Receipt', fieldName: 'Sap_Doc'},
  {label: 'Ref. Receipt Year', fieldName: 'Sap_DocYear'},
  {label: 'Request No.', fieldName: 'Hh_Ref1'},
];

export {columns, scanCodeFields, partDetail, recipientFields};
