import React from 'react';
import {formatDateString} from '../../../utils/date-util';
import {FieldConstant, dateFormat} from '../../../constants/constants';
import ItemImageList from '../../shared/item-image/ItemImageList';

export const configStep = (
  detailData,
  listComboboxData,
  isFromAssetRequestType,
  isAssetLendingType,
  secondStepView,
  onValueChange,
) => [
  firstStep(
    detailData,
    listComboboxData,
    isFromAssetRequestType,
    isAssetLendingType,
  ),
  secondStep(secondStepView),
];

const firstStep = (
  detailData,
  listComboboxData,
  isFromAssetRequestType,
  isAssetLendingType,
) => ({
  fieldsArray: [
    {
      id: 'branch',
      label: 'Branch',
      fieldName: 'branch',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.branch) || '',
    },
    {
      id: 'createdBy',
      label: 'Created By',
      fieldName: 'createdBy',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.createdBy) || '',
    },
    {
      id: 'createdDate',
      label: 'Created Date',
      fieldName: 'createdDate',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value:
        (detailData && detailData.createdDate) ||
        formatDateString(new Date(), dateFormat.createdDate),
    },
    {
      id: 'from',
      label: 'From',
      fieldName: 'from',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.from) || '',
    },
    {
      id: 'assetTransferNo',
      label: 'Asset Transfer No.',
      fieldName: 'assetTransferNo',
      fieldType: FieldConstant.type.RECIPIENT,
      iconName: 'qrcode-scan',
      require: true,
      disabled: true,
      value: (detailData && detailData.assetTransferNo) || '',
    },
    {
      id: 'location',
      label: 'Location',
      fieldName: 'location',
      fieldType: FieldConstant.type.TEXT,
      require: true,
      disabled: true,
      value: (detailData && detailData.location) || '',
      data: (listComboboxData && listComboboxData.branch) || [],
    },
    {
      id: 'note',
      label: 'Note',
      fieldName: 'note',
      fieldType: FieldConstant.type.TEXT,
      value: (detailData && detailData.ssdNo) || '',
      disabled: true,
      hidden: isFromAssetRequestType,
    },
  ],
});

const secondStep = secondStepView => ({
  customView: {
    view: () => (secondStepView ? secondStepView : null),
  },
});

const informationList = data => [
  {label: 'Asset Code', value: 'assetCode'},
  {value: 'description'},
  {label: 'Unit', value: 'unit'},
  {label: 'Asset Type', value: 'assetType'},
  {label: 'Catalog', value: 'catalog'},
  {
    customQtyField: () => data.quantity,
  },
];

export const itemsView = () => ({
  items: {
    view: data => {
      return (
        <ItemImageList
          itemData={data}
          informationList={informationList(data)}
        />
      );
    },
  },
});
