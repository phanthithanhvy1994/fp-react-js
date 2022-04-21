import {FieldConstant} from '../../../../constants/constants';
import {Styles} from './PartsReturnCreate.style';
import moment from 'moment';
import {getListYear, formatInputQuantity} from '../../../../utils/functions';

const columns = [
  {
    title: '#',
    field: 'Hh_DocItem',
    width: '15%',
  },
  {
    title: 'Part No.',
    field: 'Sap_Part',
  },
  {
    title: 'Part Create Requested',
    field: 'Hh_Quantity1',
    width: '20%',
    type: 'numeric',
    editable: true,
    format: value => formatInputQuantity(value),
    maxLength: 11,
  },
];

const scanCodeFields = [
  {
    id: 'id4',
    fieldName: 'scan',
    iconName: 'qrcode-scan',
    placeHolderText: {
      QUICK_SCAN: 'สแกนแบบเร็ว',
      ENTRY_SCAN: 'สแกนทีละรายการ',
    },
    fieldType: FieldConstant.type.SCAN,
  },
];

const partReturnFields = [
  {
    label: 'Ref. Receipt',
    id: 'refReceipt',
    fieldName: 'refReceipt',
    fieldType: FieldConstant.type.TEXT,
    maxLength: 10,
    require: true,
    customStyle: {
      fieldItem: Styles.fieldItem,
      fieldContainer: Styles.refFieldContainer,
      labelContainer: Styles.labelContainer,
    },
    value: '',
  },
  {
    label: 'Ref. Receipt Year',
    id: 'refReceiptYear',
    fieldName: 'refReceiptYear',
    fieldType: FieldConstant.type.SELECT,
    require: true,
    data: getListYear(),
    value: new Date().getFullYear(),
    customStyle: {
      selectedItem: Styles.yearFieldItem,
      fieldContainer: Styles.yearFieldContainer,
      labelContainer: Styles.labelContainer,
    },
  },
  {
    label: 'Request No.',
    id: 'requestNo',
    fieldName: 'requestNo',
    fieldType: FieldConstant.type.TEXT,
    maxLength: 16,
    customStyle: {
      fieldItem: Styles.fieldItem,
      fieldContainer: Styles.fieldContainer,
      labelContainer: Styles.labelContainer,
    },
    value: '',
  },
  {
    label: 'Date',
    id: 'date',
    fieldName: 'date',
    require: true,
    fieldType: FieldConstant.type.TEXT,
    disabled: true,
    value: moment().format('DD.MM.YYYY'),
    customStyle: {
      fieldItem: Styles.fieldItem,
      fieldContainer: Styles.fieldDateContainer,
      labelContainer: Styles.labelContainer,
    },
  },
  {
    label: 'Recipient',
    id: 'recipientFields',
    fieldName: 'Recipient',
    iconName: 'qrcode-scan',
    placeHolderText: 'Please input Recipient No. or scan it',
    fieldType: FieldConstant.type.RECIPIENT,
    customStyle: {
      fieldContainer: Styles.fieldRecipient,
      button: Styles.button,
      recipient: Styles.recipient,
      recipientInput: Styles.recipientInput,
      icon: Styles.icon,
      inputText: Styles.inputText,
      labelContainer: Styles.labelContainer,
    },
    value: '',
  },
];

export {columns, scanCodeFields, partReturnFields};
