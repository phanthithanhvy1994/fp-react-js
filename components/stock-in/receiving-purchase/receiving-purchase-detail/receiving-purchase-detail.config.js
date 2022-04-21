import {FieldConstant} from '../../../../constants/constants';
import {formatInputQuantity} from '../../../../utils/functions';

const columns = [
  {
    title: '#',
    field: 'Sap_Ref2Item',
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
    title: 'Quantity',
    field: 'Sap_Quantity',
    type: 'numeric',
  },
  {
    title: 'Received',
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

export {columns, scanCodeFields};
