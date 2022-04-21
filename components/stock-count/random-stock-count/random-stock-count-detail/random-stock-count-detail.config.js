import {FieldConstant} from '../../../../constants/constants';
import {formatInputQuantity} from '../../../../utils/functions';

const columns = [
  {
    title: '#',
    field: 'Sap_DocItem',
  },
  {
    title: 'Storage Bin',
    field: 'Sap_Bin',
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
    title: 'On-hand',
    field: 'Sap_Quantity2',
    type: 'numeric',
    width: 60,
  },
  {
    title: 'Counted',
    field: 'Sap_Quantity',
    type: 'numeric',
    format: value => formatInputQuantity(value),
    width: 55,
  },
  {
    title: 'Counting',
    field: 'Hh_Quantity1',
    type: 'numeric',
    editable: true,
    format: value => formatInputQuantity(value),
    maxLength: 6,
    width: 55,
  },
  {
    title: 'Zero Counted',
    field: 'Sap_CheckBox',
    type: 'checkbox',
    width: 55,
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

export {columns, scanCodeFields};
