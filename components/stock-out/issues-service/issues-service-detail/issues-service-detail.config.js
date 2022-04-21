import {FieldConstant} from '../../../../constants/constants';
import {formatInputQuantity, formatHhDoc} from '../../../../utils/functions';
import moment from 'moment';

const columns = [
  {
    title: '#',
    field: 'Sap_DocItem',
  },
  {
    title: 'Part No.',
    field: 'Sap_Part',
  },
  {
    title: 'Part Name',
    field: 'Sap_Partname',
    type: 'text',
  },
  {
    title: 'Issues Quantity',
    field: 'Sap_Quantity',
    type: 'numeric',
  },
  {
    title: 'Picked',
    field: 'Hh_Quantity1',
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

const itemDetail = [
  {
    label: 'HH Document',
    fieldName: 'Hh_Doc',
    format: value => formatHhDoc(value),
  },
  {
    label: 'Date',
    fieldName: 'Sap_DocDate',
    format: value => moment(value).format('DD.MM.YYYY'),
  },
  {label: 'Packing No.', fieldName: 'Sap_Doc'},
  {label: 'Year', fieldName: 'Sap_DocYear'},
  {label: 'Issues Order No.', fieldName: 'Sap_Ref1'},
  {label: 'Customer', fieldName: 'Sap_Bp'},
  {label: 'Customer Name', fieldName: 'Sap_BpName'},
];

export {columns, scanCodeFields, itemDetail, recipientFields};
