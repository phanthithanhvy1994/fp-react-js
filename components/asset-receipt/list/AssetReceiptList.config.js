import moment from 'moment';
import { FieldConstant } from '../../../constants/constants';

// From: 1st date of the current month
// To: current date
const defaultDateFrom = moment().clone().startOf('month');
const defaultDateTo = moment();

const filterField = [
  {
    id: 'assetRequestNo',
    label: 'Asset Request No.',
    fieldName: 'assetRequestNo',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'assetTransferNo',
    label: 'Asset Transfer No.',
    fieldName: 'assetTransferNo',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'createdDate',
    fieldName: 'createdDate',
    labelName: 'Created Date',
    fieldType: FieldConstant.type.DATE_FROM_TO,
    inputType: 'date',
    from: {
      label: 'DateFrom',
      id: 'dateFrom',
      fieldName: 'dateFrom',
      value: defaultDateFrom,
      placeHolderText: 'Choose Date',
    },
    to: {
      label: 'DateTo',
      id: 'dateTo',
      fieldName: 'dateTo',
      value: defaultDateTo,
      placeHolderText: 'Choose Date',
    },
  },
  {
    id: 'status',
    label: 'Status',
    fieldName: 'status',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    value: '',
  },
  {
    id: 'from',
    label: 'From',
    fieldName: 'from',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    value: '',
  },
];

export { filterField };
