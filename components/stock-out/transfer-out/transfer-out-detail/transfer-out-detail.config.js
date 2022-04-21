import {FieldConstant} from '../../../../constants/constants';
import moment from 'moment';
import {formatInputQuantity, formatHhDoc} from '../../../../utils/functions';

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
    title: 'Transfer Out Quantity',
    field: 'Sap_Quantity',
    type: 'numeric',
  },
  {
    title: 'Transfer Out Picked',
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
    // [HONDAIPB-CR] - 17/06/2020 - Place holder
    id: 'recipientFields',
    fieldName: 'Hh_Recipient',
    iconName: 'qrcode-scan',
    placeHolderText: 'Recipient_PlaceHolder_O_TRANSFER',
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
  {label: 'Packing (TRF) No.', fieldName: 'Sap_Doc'},
  {label: 'Year', fieldName: 'Sap_DocYear'},
  {label: 'Transfer Order No.', fieldName: 'Sap_Ref1'},
  {label: 'Receiving Site', fieldName: 'Sap_Bp'},
  {label: 'Transfer Site Name', fieldName: 'Sap_BpName'},
];

export {columns, scanCodeFields, itemDetail, recipientFields};
