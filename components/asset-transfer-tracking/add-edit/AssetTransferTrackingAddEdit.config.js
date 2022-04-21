import React from 'react';
import { formatDateString } from '../../../utils/date-util';
import ItemImageList from '../../shared/item-image/ItemImageList';
import Field from '../../shared/fields/field';
import HeaderComponentStyles from '../../core/HeaderComponent.style';
import { FieldConstant, dateFormat, MessageConstant } from '../../../constants/constants';
import { Text, View } from 'native-base';
import * as Yup from 'yup';
import { styles } from './AssetTransferTrackingAddEdit.style';

export const configStep = (detailData, loggerUser, onATNoChange, onATNoAddIconClick, onRemoveAssetTransferNo, onChangeConfirmed) => ([
  firstStep(detailData, loggerUser, onATNoChange, onATNoAddIconClick, onRemoveAssetTransferNo),
  secondStep(detailData, onChangeConfirmed),
]);

const firstStep = (detailData, loggerUser, onATNoChange, onATNoAddIconClick, onRemoveAssetTransferNo) => ({
  fieldsArray: [{
    id: 'createdBy',
    label: 'Created By',
    fieldName: 'createdBy',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.createdBy) || loggerUser.name || '',
  },
  {
    id: 'createdDate',
    label: 'Created Date',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.createdDate) || formatDateString(new Date(), dateFormat.mainDate),
  },
  {
    id: 'assetTransferNo',
    label: 'Asset Transfer No.',
    fieldName: 'assetTransferNo',
    fieldNameError: 'listATNo',
    fieldType: FieldConstant.type.RECIPIENT,
    require: true,
    iconName: 'qrcode-scan',
    placeHolderText: 'Please input Asset Transfer No. or scan it',
    value: (detailData && detailData.assetTransferNo) || '',
    hidden: false,
    onChange: onATNoChange,
    hasAddIcon: true,
    onClickAddIcon: onATNoAddIconClick,
    listAddedData: (detailData && detailData.listATNo) || [],
    removeChildItem: onRemoveAssetTransferNo,
    childAddedItemList: {
      id: 'addedItemAT',
      fieldType: FieldConstant.type.TEXT,
      styleName: 'childAddedDisabledItem',
      disabled: true,
    }
  },
  {
    id: 'notes',
    label: 'Note',
    fieldName: 'notes',
    maxLength: 256,
    fieldType: FieldConstant.type.TEXT,
    value: (detailData && detailData.notes) || '',
    hidden: false
  },
]});

const secondStep = (detailData, onChangeConfirmed) => ({
  listItems: {
    listData: detailData?.assetTransferDetailList || [],
    beforeLineItem: {
      view: (item) => {
        return (
        <View>
          <Text style={[styles.headerItem, styles.textAssetTransfer]}>
            Asset Transfer No.: {item.assetTransferNo}
          </Text>
          
          <View style={styles.viewBranch}>
            <Text style={[styles.headerItem, styles.textBranch]}>
              From {item.branchNameFrom} to {item.branchNameTo}
            </Text>
          </View>
        </View>
        )
      }
    },
    lineItem: {
      view: (item, index) => (
        <View id={index} style={styles.lineItem}>
          {item.assetTransferDetailTbls?.map((itemChild, indexChild) => (
              <View style={styles.headerItem} key={indexChild}>
                <ItemImageList
                  itemData={itemChild}
                  informationList={informationList(itemChild)}
                />
                <View>
                  <Field 
                    conditionalArray={fieldsConfirmed(itemChild, index, indexChild )}
                    onChange={onChangeConfirmed}
                  />
                </View>
              </View>
            ))
          }
        </View>
      )
    },
  }
});

const fieldsConfirmed = (itemChild, index, indexChild ) => [
  {
    id: 'confirmed',
    fieldName: `confirmed-${index}-${indexChild}`,
    fieldType: FieldConstant.type.RECEIVED,
    value: !!(itemChild.confirmed) || false,
    label: 'Confirmed'
  },
];

const informationList = (item) => [
  { 
    customValue: () => (
      <View>
            <Text>
                Asset Code: {item.assetMasterTbl.assetNo}
            </Text>

            <Text>
                {item.assetMasterTbl.description}
            </Text>
            <Text>
              {item?.assetMasterTbl?.quantity || 0} {item?.assetMasterTbl?.uom || ''}
            </Text>
      </View>
    ),
    customQtyField: () => (
      <Text style={styles.quantityLabel}>{item?.quantity || 0}</Text>
    ),
  }
];

export const validationSchema = (t) => {
  const msg = t(MessageConstant.msgRequired).replace('<Field>', t('assetTransferNo'));
  
  return Yup.object().shape({
    listATNo: Yup.array().nullable().min(1, msg).required(msg),
  });
}

export const customButtonStep = (scan) => ({
  stepCustom: 2,
  buttonCustom: [
    {
      name: "qrcode",
      action: scan,
      type: HeaderComponentStyles.icon,
    },
  ]
});

export const bottomActionNextBtnConfig = [
  {}, // at step 1
  { 
    save: true,
    fullWidthBtn: {
      label: 'CONFIRM',
      styles: styles
    }
  }, // at step 2
];