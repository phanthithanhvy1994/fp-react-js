import { FieldConstant } from '../../../constants/constants';

const filterField = [
  {
    id: 'materialDocument',
    label: 'Material Document',
    fieldName: 'materialDocument',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'refNumber',
    label: 'PO/DO No.',
    fieldName: 'refNumber',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'goodReceiptType',
    label: 'Type',
    fieldName: 'goodReceiptType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    value: '',
  },
  {
    id: 'submittedTime',
    fieldName: 'submittedTime',
    labelName: 'Submitted Time',
    fieldType: FieldConstant.type.DATE_FROM_TO,
    inputType: 'date',
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
    id: 'sapExportedStatus',
    label: 'Status',
    fieldName: 'sapExportedStatus',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    value: '',
  },
  {
    id: 'deliveryNote',
    label: 'Invoice No./Delivery Note',
    fieldName: 'deliveryNote',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'vendor',
    label: 'Vendor',
    fieldName: 'vendor',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    value: '',
  },
  {
    id: 'materialDescription',
    label: 'Material Description',
    fieldName: 'materialDescription',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'batchNo',
    label: 'Batch No.',
    fieldName: 'batchNo',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'poStoNumber',
    label: 'PO-STO No.',
    fieldName: 'poStoNumber',
    fieldType: FieldConstant.type.TEXT,
  },
];


export {filterField};
