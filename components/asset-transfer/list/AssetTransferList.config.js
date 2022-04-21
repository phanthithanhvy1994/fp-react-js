import moment from 'moment';
import { FieldConstant, dateFormat } from '../../../constants/constants';

// From: 1st date of the current month
// To: current date
const defaultDateFrom = moment().clone().startOf('month');
const defaultDateTo = moment();

const filterField = [
  {
    id: 'assetTransferNo',
    label: 'Asset Transfer No.',
    fieldName: 'assetTransferNo',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'assetRequestNo',
    label: 'Asset Request No.',
    fieldName: 'assetRequestNo',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'assetTransferType',
    label: 'Type',
    fieldName: 'assetTransferType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    value: '',
  },
  {
    id: 'createdDate',
    fieldName: 'createdDate',
    labelName: 'Created Date',
    fieldType: FieldConstant.type.DATE_FROM_TO,
    inputType: 'date',
    from: {
      label: '',
      id: 'createdDateFrom',
      fieldName: 'createdDateFrom',
      value: defaultDateFrom,
      placeHolderText: 'Choose Date',
    },
    to: {
      label: '',
      id: 'createdDateTo',
      fieldName: 'createdDateTo',
      value: defaultDateTo,
      placeHolderText: 'Choose Date',
    },
  },
  {
    id: 'submittedDate',
    fieldName: 'submittedDate',
    labelName: 'Submitted Date',
    fieldType: FieldConstant.type.DATE_FROM_TO,
    inputType: 'date',
    from: {
      label: '',
      id: 'submittedDateFrom',
      fieldName: 'submittedDateFrom',
      value: '',
      defaultBlank: true,
      placeHolderText: 'Choose Date',
    },
    to: {
      label: '',
      id: 'submittedDateTo',
      fieldName: 'submittedDateTo',
      value: '',
      defaultBlank: true,
      placeHolderText: 'Choose Date',
    },
  },
  {
    id: 'assetTransferStatus',
    label: 'Status',
    fieldName: 'assetTransferStatus',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    value: '',
  },
  {
    id: 'fixzy/SSDNo',
    label: 'Fixzy/SSD No.',
    fieldName: 'sSDNo',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'requestFromBranch',
    label: 'From',
    fieldName: 'requestFromBranch',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    value: '',
  },
  {
    id: 'requestToBranch',
    label: 'To',
    fieldName: 'requestToBranch',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    value: '',
  },
];

export { filterField };
