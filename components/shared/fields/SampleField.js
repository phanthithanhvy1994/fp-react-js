import {FieldConstant} from '../../../constants/constants';

const SampleField = [
  {
    label: 'textBox',
    id: 'id',
    fieldName: 'textName',
    fieldType: FieldConstant.type.TEXT,
  },
  {
    id: 'id1',
    fieldName: 'date',
    fieldType: FieldConstant.type.DATE_FROM_TO,
    from: {
      label: 'Label',
      id: 'id1_1',
      fieldName: 'pickerFrom',
    },
    to: {
      label: 'Label',
      id: 'id1_2',
      fieldName: 'pickerTo',
    },
  },

  {
    label: 'Select Label',
    id: 'id2',
    fieldName: 'select',
    fieldType: FieldConstant.type.SELECT,
    data: [
      {
        display: 'Ten',
        value: 10,
      },
      {
        display: 'Twenty',
        value: 20,
      },
    ],
  },
];

export default SampleField;
