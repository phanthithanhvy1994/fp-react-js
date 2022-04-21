import React from 'react';
import { formatDateString } from '../../../utils/date-util';
import { FieldConstant, ATConstant, dateFormat, MessageConstant, AssetTransfer } from '../../../constants/constants';
import ItemImageList from '../../shared/item-image/ItemImageList';
import { Text, View } from 'native-base';
import * as Yup from 'yup';
import { MESSAGE } from '../../../constants/message';
import { styles } from './AssetTransferAddEdit.style';
import HeaderComponentStyles from '../../core/HeaderComponent.style';
// import Field from '../fields/field';
import Field from '../../shared/fields/field';
import ItemAssetrequestMaster from './item-asset-request-master/ItemAssetrequestMaster'

export const configStep = (detailData, listComboboxData, onARNoChange, onARNoAddIconClick, onRemoveAssetRequestNo, changeFieldStep, typeChange, onPressMasterId, deleteAssetMaster) => ([
  firstStep(detailData, listComboboxData, onARNoChange, onARNoAddIconClick, onRemoveAssetRequestNo),
  secondStep(detailData, listComboboxData, changeFieldStep, typeChange, onPressMasterId, deleteAssetMaster),
]);

const firstStep = (detailData, listComboboxData, onARNoChange, onARNoAddIconClick, onRemoveAssetRequestNo) => {
  let lendingDateFrom = (detailData && detailData.lendingDateFrom) || new Date();
  let lendingDateTo = (detailData && detailData.lendingDateTo) || new Date();
  const isCreateDateServerFormat = detailData && detailData.createdDate && detailData.createdDate.match(dateFormat.serverFormatRegex);

  lendingDateFrom = typeof lendingDateFrom === 'object' ? lendingDateFrom.toLocaleDateString() : lendingDateFrom;
  lendingDateTo = typeof lendingDateTo === 'object' ? lendingDateTo.toLocaleDateString() : lendingDateTo;
  return {
    fieldsArray: [{
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
      value: formatDateString((detailData && detailData.createdDate) || new Date(), dateFormat.mainDate, isCreateDateServerFormat),
    },
    {
      id: 'assetTransferType',
      label: 'Type',
      fieldName: 'assetTransferType',
      fieldType: FieldConstant.type.SELECT,
      require: true,
      value: (detailData && detailData.assetTransferType) || '',
      data: (listComboboxData && listComboboxData.type) || [],
      defaultBlank: true
    },
    {
      id: 'assetRequestNo',
      label: 'Asset Request No.',
      fieldName: 'assetRequestNo',
      fieldNameError: 'listARNo',
      fieldType: FieldConstant.type.RECIPIENT,
      require: true,
      iconName: 'qrcode-scan',
      placeHolderText: 'Please input Asset Rquest No. or scan it',
      value: (detailData && detailData.assetRequestNo) || '',
      hidden: !detailData.assetTransferType || detailData.assetTransferType !== ATConstant.typeValue.fromAR,
      onChange: onARNoChange,
      hasAddIcon: true,
      onClickAddIcon: onARNoAddIconClick,
      listAddedData: (detailData && detailData.listARNo) || [],
      removeChildItem: onRemoveAssetRequestNo,
      childAddedItemList: {
        id: 'addedItemAR',
        fieldType: FieldConstant.type.TEXT,
        styleName: 'childAddedDisabledItem',
        disabled: true,
      }
    },
    {
      id: 'branchCodeFrom',
      label: 'From',
      fieldName: 'branchCodeFrom',
      fieldType: FieldConstant.type.SELECT,
      disabled: !detailData.assetTransferType || detailData.assetTransferType === ATConstant.typeValue.fromAR,
      require: true,
      value: (detailData && detailData.branchCodeFrom) || '',
      data: (listComboboxData && listComboboxData.branch) || [],
      defaultBlank: true,
      hidden: !detailData.assetTransferType
    },
    {
      id: 'branchCodeTo',
      label: 'To',
      fieldName: 'branchCodeTo',
      fieldType: FieldConstant.type.SELECT,
      disabled: !detailData.assetTransferType || ATConstant.typeValue.listTypeDisableToField.indexOf(
        detailData.assetTransferType
      ) !== -1,
      require: true,
      value: (detailData && detailData.branchCodeTo) || '',
      data: (listComboboxData && listComboboxData.branch) || [],
      defaultBlank: true,
      hidden: !detailData.assetTransferType
    },
    {
      id: 'ssdNo',
      label: 'Fixzy/SSD No.',
      fieldName: 'ssdNo',
      fieldType: FieldConstant.type.TEXT,
      value: (detailData && detailData.ssdNo) || '',
      data: [],
      disabled: !detailData.assetTransferType || detailData.assetTransferType === ATConstant.typeValue.fromAR,
      hidden: !detailData.assetTransferType || (detailData.assetTransferType === ATConstant.typeValue.fromAR)
    },
    {
      id: 'lendingPeriod',
      labelName: 'Lending Period',
      fieldName: 'lendingPeriod',
      fieldType: FieldConstant.type.DATE_FROM_TO,
      require: true,
      value: (detailData && detailData.lendingPeriod) || '',
      hidden: !detailData.assetTransferType || detailData.assetTransferType !== ATConstant.typeValue.assetLending,
      from: {
        fieldName: 'lendingDateFrom',
        value: formatDateString(lendingDateFrom, dateFormat.yyyymmdd, true)
      },
      to: {
        fieldName: 'lendingDateTo',
        value: formatDateString(lendingDateTo, dateFormat.yyyymmdd, true)
      },
    },
    {
      id: 'notes',
      label: 'Note',
      fieldName: 'notes',
      fieldType: FieldConstant.type.TEXT,
      value: (detailData && detailData.notes) || '',
      hidden: !detailData.assetTransferType
    },
    ]
  }
};

const informationList = (data) => [
  { label: 'Asset Code', value: 'assetCode' },
  { value: 'description' },
  {
    customValue: () => {
      return <Text>{`${data.quantity || ''} ${data.unit || ''}`}</Text>;
    }
  },
];

const secondStep = (detailData, listComboboxData, changeFieldStep, typeChange, onPressMasterId, deleteAssetMaster) => {
  return ({
    listItems: {
      listData: detailData.assetTransferDetailTbls || [],
      lineItem: {
        view: (data, index) => {
          return <ItemAssetrequestMaster
            indexAssetRequest={index}
            data={data}
            onPressMasterId={onPressMasterId}
            changeFieldStep={changeFieldStep}
            listComboboxData={listComboboxData}
            typeChange={typeChange}
            deleteAssetMaster={deleteAssetMaster}
            branchCodeTo={detailData.branchCodeTo}
          />;
        }
      },
    }
  });
};

export const bottomActionNextBtnConfig = [
  {}, // at step 1
  {
    save: true, fullWidthBtn: {
      label: 'SUBMIT',
      styles: styles
    }
  }, // at step 2
];

export const validationSchema = (t) => Yup.object().shape({
  assetTransferType: Yup.string().required(t(MessageConstant.msgRequired).replace('<Field>', t('type'))),
});

export const validationSchemaForARType = (t) => Yup.object().shape({
  branchCodeFrom: Yup.string().required(t(MessageConstant.msgRequired).replace('<Field>', t('from'))),
  branchCodeTo: Yup.string().required(t(MessageConstant.msgRequired).replace('<Field>', t('to'))),
  assetTransferType: Yup.string().required(t(MessageConstant.msgRequired).replace('<Field>', t('type'))),
  listARNo: Yup.array().nullable().required(t(MessageConstant.msgRequired).replace('<Field>', t('assetRequestNo'))),
});

export const validationSchemaForOtherType = (t) => Yup.object().shape({
  branchCodeFrom: Yup.string().required(t(MessageConstant.msgRequired).replace('<Field>', t('from'))),
  assetTransferType: Yup.string().required(t(MessageConstant.msgRequired).replace('<Field>', t('type'))),
});

export const validationSchemaForSpecialType = (t) => Yup.object().shape({
  branchCodeFrom: Yup.string().required(t(MessageConstant.msgRequired).replace('<Field>', t('from'))),
  branchCodeTo: Yup.string().required(t(MessageConstant.msgRequired).replace('<Field>', t('to'))),
  assetTransferType: Yup.string().required(t(MessageConstant.msgRequired).replace('<Field>', t('type'))),
});

export const customButtonStep = (scan, shopping) => ({
  stepCustom: 2,
  buttonCustom: [
    {
      name: "shopping-cart",
      action: shopping,
      type: HeaderComponentStyles.icon,
    },
    {
      name: "qrcode",
      action: scan,
      type: HeaderComponentStyles.icon,
    },
  ]
})

