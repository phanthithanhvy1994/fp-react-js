import React from 'react';
import { formatDateString } from '../../../utils/date-util';
import { FieldConstant, ATConstant, dateFormat } from '../../../constants/constants';
import ItemImageList from '../../shared/item-image/ItemImageList';
import { Text, View } from 'native-base';
import { styles } from './asset-transfer-details.style';
import Field from '../../shared/fields/field';

export const configStep = (detailData, listComboboxData, arNoArr, isFromAssetRequestType, isAssetLendingType, secondStepView, onValueChange) => ([
    firstStep(detailData, listComboboxData, arNoArr, isFromAssetRequestType, isAssetLendingType),
    secondStep(secondStepView),
]);

// const fullWidthCancelBtn = {
//     label: 'CANCEL',
//     styles: styles,
//     disabled: false
// };

export const bottomActionNextBtnConfig = [
    { next: true }, // at step 1
    { next: true }, // at step 2
];

const firstStep = (detailData, listComboboxData, arNoArr, isFromAssetRequestType, isAssetLendingType) => {
    let lendingDateFrom = (detailData && detailData.lendingDateFrom);
    let lendingDateTo = (detailData && detailData.lendingDateTo);

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
            value: (detailData && detailData.createdDate && formatDateString(detailData.createdDate, dateFormat.mainDate, true))
        },
        {
            id: 'submittedDate',
            label: 'Submitted Date',
            fieldName: 'submittedDate',
            fieldType: FieldConstant.type.TEXT_ONLY,
            value: (detailData && detailData.updatedDate && formatDateString(detailData.updatedDate, dateFormat.mainDate, true))
        },
        {
            id: 'assetTransferType',
            label: 'Type',
            fieldName: 'assetTransferType',
            fieldType: FieldConstant.type.SELECT,
            require: true,
            disabled: true,
            value: (detailData && detailData.assetTransferType) || '',
            data: (listComboboxData && listComboboxData.type) || [],
            defaultBlank: true
        },
        {
            id: 'assetRequestNo',
            label: 'Asset Request No.',
            fieldName: 'assetRequestNo',
            fieldType: FieldConstant.type.RECIPIENT,
            require: true,
            disabled: true,
            iconName: 'qrcode-scan',
            hidden: !isFromAssetRequestType,

            hasAddIcon: true,
            value: (arNoArr && arNoArr) || '',
            listAddedData: (arNoArr && arNoArr) || [],
            childAddedItemList: {
                id: 'assetTransferNoItem',
                fieldType: FieldConstant.type.TEXT,
                styleName: 'assetTransferNoItem',
                disabled: true,
            },
            isAssetTransTransferTracking: true,
        },
        {
            id: 'branchFrom',
            label: 'From',
            fieldName: 'branchFrom',
            fieldType: FieldConstant.type.TEXT,
            require: true,
            disabled: true,
            value: (detailData && detailData.branchNameFrom) || '',
        },
        {
            id: 'branchTo',
            label: 'To',
            fieldName: 'branchTo',
            fieldType: FieldConstant.type.TEXT,
            require: true,
            disabled: true,
            value: (detailData && detailData.branchNameTo) || '',
        },
        {
            id: 'ssdNo',
            label: 'Fixzy/SSD No.',
            fieldName: 'ssdNo',
            fieldType: FieldConstant.type.TEXT,
            value: (detailData && detailData.ssdNo) || '',
            disabled: true,
            hidden: isFromAssetRequestType,
        },
        {
            id: 'lendingPeriod',
            labelName: 'Lending Period',
            fieldName: 'lendingPeriod',
            fieldType: FieldConstant.type.DATE_FROM_TO,
            require: true,
            disabled: true,
            value: (detailData && detailData.lendingPeriod) || '',
            hidden: !isAssetLendingType,
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
            disabled: true,
            value: (detailData && detailData.notes) || '',
        },
        ]
    };
}

const locationField = (data, listComboboxData) => [{
    id: 'location',
    label: '',
    fieldName: 'location',
    fieldType: FieldConstant.type.SELECT,
    disabled: true,
    value: data.assetLocationCode || '',
    data: listComboboxData.location || [],
    defaultBlank: true
},];

const informationList = (data) => [
    { label: 'Asset Code', value: 'assetNo' },
    { value: 'description' },
    {
        customValue: () => (<>{`<${data.quantity}><${data.baseUom}>`}</>),
    },
    {
        customQtyField: () => data.quantity,
        customQtyFieldStyle: styles.customQtyFieldStyle,
    },
];

export const itemsView = () => ({
    before: {
        view: () => {
            // return <Text>after-line-demo</Text>;
        },
    },
    items: {
        view: (data) => {
            return <ItemImageList
                itemData={data}
                informationList={informationList(data)}
            />;
        }
    },
    after: {
        view: (data, listComboboxData) => {
            return (<View style={styles.locationFld}>
                <Field
                    conditionalArray={locationField(data, listComboboxData)}
                    isPortTrait={false}
                />
            </View>)
        },
    },
});

const secondStep = (secondStepView) => ({
    customView: {
        view: () => secondStepView ? secondStepView : null
    },
});
