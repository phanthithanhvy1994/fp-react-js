import { FieldConstant, GRConstant } from '../../../constants/constants';

import { MESSAGE } from '../../../constants/message';
import isEmpty from 'lodash/isEmpty';
import { styles } from './GoodsReceiptAddEdit.style';
import * as Yup from 'yup';

export const configStep = (
  detailData,
  isBranchPOType,
  disableFld,
  sndStepView,
  lastStepView,
) => [
    firstStep(detailData, isBranchPOType, disableFld),
    secondStep(sndStepView),
    lastStep(lastStepView),
  ];

const firstStep = (detailData, isBranchPOType, disableFld) => ({
  fieldsArray: [
    {
      id: 'goodReceiptTypeName',
      label: 'Type',
      fieldName: 'goodReceiptTypeName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.goodReceiptTypeName) || '',
    },
    {
      id: 'branchName',
      label: 'Branch',
      fieldName: 'branchName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.branchName) || '',
    },
    {
      id: 'factoryName',
      label: 'Factory',
      fieldName: 'factoryName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.factoryName) || '',
    },
    {
      id: 'vendorName',
      label: 'Vendor',
      fieldName: 'vendorName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.vendorName) || '',
    },
    {
      id: 'poStoNumber',
      label: 'PO-STO No.',
      fieldName: 'poStoNumber',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && !isBranchPOType && detailData.poStoNumber) || '',
    },
    {
      id: 'createdBy',
      label: 'Created By',
      fieldName: 'createdBy',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.createdBy) || '',
    },
    {
      id: 'refNumber',
      label: 'PO/DO No.',
      fieldName: 'refNumber',
      fieldType: FieldConstant.type.RECIPIENT,
      require: true,
      iconName: 'qrcode-scan',
      placeHolderText: 'Please input Ref. No. or scan it',
      value: (detailData && detailData.refNumber) || '',
      keyboardType: 'numeric',
      disabled: disableFld,
      maxLength: 10,
    },
    {
      id: 'truckTemperature',
      label: 'Truck Temperature',
      fieldName: 'truckTemperature',
      fieldType: FieldConstant.type.TEXT,
      require: !isBranchPOType,
      value: (detailData && detailData.truckTemperature) || '',
      keyboardType: 'numeric',
      maxLength: 4,
    },
    {
      id: 'deliveryNote',
      label: 'Invoice No./Delivery Note',
      fieldName: 'deliveryNote',
      fieldType: FieldConstant.type.TEXT,
      require: isBranchPOType,
      hidden: !isBranchPOType,
      value: (detailData && detailData.deliveryNote) || '',
      maxLength: 256,
    },
    {
      id: 'note',
      label: 'Note',
      fieldName: 'note',
      fieldType: FieldConstant.type.TEXT,
      value: (detailData && detailData.note) || '',
    },
  ],
});

const secondStep = sndStepView => ({
  customView: {
    view: () => (sndStepView ? sndStepView : null),
  },
});

const lastStep = lastStepView => ({
  customView: {
    view: () => (lastStepView ? lastStepView : null),
  },
});

export const lastViewFields = (
  detailData,
  isBranchPoType,
  listMaterial,
  listMaterialForProduct1,
  listMaterialForProduct2,
  disabledProductTemp2,
  listMaterialForProduct3,
  disabledProductTemp3,
) => [
    {
      id: 'productTemperature1',
      label: 'Product Temperature 1',
      fieldName: 'sku1',
      fieldType: FieldConstant.type.SELECT,
      require: !isBranchPoType,
      data: [...listMaterialForProduct1],
      value: '',
      defaultBlank: true,
    },
    {
      id: 'productTemperature2',
      label: 'Product Temperature 2',
      fieldName: 'sku2',
      fieldType: FieldConstant.type.SELECT,
      require: !isBranchPoType,
      data: [...listMaterialForProduct2],
      value: '',
      disabled: disabledProductTemp2,
      defaultBlank: true,
    },
    {
      id: 'productTemperature3',
      label: 'Product Temperature 3',
      fieldName: 'sku3',
      fieldType: FieldConstant.type.SELECT,
      require: !isBranchPoType,
      data: [...listMaterialForProduct3],
      value: '',
      disabled: disabledProductTemp3,
      defaultBlank: true,
    },
  ];

export const tempArr = (
  detailData,
  isBranchPoType,
  listMaterial,
  disabledTemperature1,
  disabledTemperature2,
  disabledTemperature3,
) => [
    {
      id: 'temperature1',
      fieldName: 'productTemperature1',
      fieldType: FieldConstant.type.QUANTITY,
      value: '',
      defaultValue: '',
      minimumValue: -999999,
      customStyle: styles,
      disabled: disabledTemperature1,
      maxLength: 4,
    },
    {
      id: 'temperature2',
      fieldName: 'productTemperature2',
      fieldType: FieldConstant.type.QUANTITY,
      value: '',
      defaultValue: '',
      minimumValue: -999999,
      customStyle: styles,
      disabled: disabledTemperature2,
      maxLength: 4,
    },
    {
      id: 'temperature3',
      fieldName: 'productTemperature3',
      fieldType: FieldConstant.type.QUANTITY,
      value: '',
      defaultValue: '',
      minimumValue: -999999,
      customStyle: styles,
      disabled: disabledTemperature3,
      maxLength: 4,
    },
  ];

export const attachedImagesField = [
  {
    label: '',
    id: 'attachedImages',
    fieldName: 'attachedImages',
    fieldType: FieldConstant.type.UPLOAD_IMAGE,
    maxImage: 4,
    disableUpload: false,
  },
];

export const validationDOSchema = Yup.object().shape({
  refNumber: Yup.string()
    .trim()
    .required(MESSAGE.M001.replace('<Field>', GRConstant.validate.refNo)),
  truckTemperature: Yup.string()
    .trim()
    .required(
      MESSAGE.M001.replace('<Field>', GRConstant.validate.truckTemperature),
    ),
});

export const validationPOSchema = Yup.object().shape({
  refNumber: Yup.string()
    .trim()
    .required(MESSAGE.M001.replace('<Field>', GRConstant.validate.refNo)),
  deliveryNote: Yup.string()
    .trim()
    .required(
      MESSAGE.M001.replace('<Field>', GRConstant.validate.deliveryNote),
    ),
});

export const validationErrorConfigForLastView = {
  sku1: MESSAGE.M001.replace(
    '<Field>',
    GRConstant.validate.productTemperature1,
  ),
  sku2: MESSAGE.M001.replace(
    '<Field>',
    GRConstant.validate.productTemperature2,
  ),
};

export const bottomActionNextBtnConfig = [
  { save: true }, // at step 1
  { save: true }, // at step 2
  { submit: true }, // at step 3
];

export const sndField = (
  id,
  itemData,
  isBranchPOType,
  isEditPage,
  deliveryTypeData,
) => {
  return isBranchPOType
    ? POField(id, itemData, isBranchPOType, isEditPage)
    : DOField(id, itemData, isEditPage, deliveryTypeData);
};

const DOField = (id, itemData, isEditPage, deliveryTypeData) => [
  {
    id: id,
    fieldName: 'deliveryType',
    fieldType: FieldConstant.type.SELECT,
    value: +itemData.deliveryType?.toString(),
    defaultValue: itemData.deliveryType ? itemData.deliveryType : null,
    defaultBlank: true,
    data: deliveryTypeData,
    customStyle: {
      selectedItem: styles.selectedItem,
      fieldContainer: styles.fieldContainer,
      customView: styles.customView,
    },
  },
  {
    id: id,
    fieldName: isEditPage ? 'adjQty' : 'qty',
    fieldType: FieldConstant.type.QUANTITY,
    value: isEditPage
      ? (itemData.adjQty && itemData.adjQty?.toString()) || '0'
      : (itemData.qty && itemData.qty?.toString()) || '0',
    defaultValue: itemData.adjQty?.toString(),
    errors:
      (isEditPage ? +itemData.adjQty === 0 : +itemData.qty === 0) &&
      !isEmpty(itemData.deliveryType),
    disabled:
      (isEditPage ? +itemData.adjQty === 0 : +itemData.qty === 0) &&
      isEmpty(itemData.deliveryType),
    customStyle: { customQuantityView: styles.customDOQuantityView },
    maximumValue:
      itemData.deliveryType === GRConstant.deliveryType.underDelivery &&
      +itemData.quantity,
  },
  {
    id: id,
    fieldName: 'isReceived',
    fieldType: FieldConstant.type.RECEIVED,
    value: itemData.isReceived,
  },
];

const POField = (id, itemData, isBranchPOType, isEditPage) => [
  {
    id: id,
    fieldName: 'isReceived',
    fieldType: FieldConstant.type.RECEIVED,
    value: itemData.isReceived,
  },
  {
    id: id,
    fieldName: isEditPage ? 'quantity' : 'qty',
    fieldType: FieldConstant.type.QUANTITY,
    value: isEditPage
      ? itemData.quantity?.toString()
      : itemData.qty?.toString() || '0',
    defaultValue: itemData.quantity?.toString(),
    isBranchPOType,
    errors: isEditPage ? +itemData.quantity === 0 : +itemData.qty === 0,
    customStyle: { customQuantityView: styles.customPOQuantityView },
    maximumValue: +itemData.quantity.toString(),
    minimumValue: 0,
  },
];
