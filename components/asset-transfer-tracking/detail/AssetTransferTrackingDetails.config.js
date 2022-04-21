import React from 'react';
import { formatDateString } from '../../../utils/date-util';
import { FieldConstant, ATConstant, dateFormat } from '../../../constants/constants';
import ItemImageList from '../../shared/item-image/ItemImageList';
import { Text, View } from 'native-base';
import { styles } from './AssetTransferTrackingDetails.style';
import { statusConst, NumberConstant } from '../../../constants/constants';

export const configStep = (detailData, lstAssetTransferNo) => ([
    firstStep(detailData, lstAssetTransferNo),
    secondStep(detailData),
]);

export const bottomActionNextBtnConfig = [
    { next: true }, // at step 1
    { next: false }, // at step 2
];

const firstStep = (detailData, lstAssetTransferNo) => ({
    fieldsArray: [
        {
            id: 'createdBy',
            label: 'Create By',
            fieldName: 'createdBy',
            fieldType: FieldConstant.type.TEXT_ONLY,
            value: (detailData && detailData.createdBy) || '',
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
            fieldType: FieldConstant.type.RECIPIENT,
            hasAddIcon: true,
            value: (lstAssetTransferNo && lstAssetTransferNo) || '',
            listAddedData: (lstAssetTransferNo && lstAssetTransferNo) || [],
            childAddedItemList: {
                id: 'assetTransferNoItem',
                fieldType: FieldConstant.type.TEXT,
                styleName: 'assetTransferNoItem',
                disabled: true,
            },
            isAssetTransTransferTracking: true,
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
});

const informationList = (data) => [
    {
        customValue: () => (
            <View>
                <View>
                    <Text>
                        Asset Code: {`${data.assetMasterTbl.assetNo} `}
                    </Text>

                    <Text>
                        {`${data.assetMasterTbl.description}`}
                    </Text>
                </View>

                <View style={styles.contentQuantity}>
                    <View style={styles.textQuantity}>
                        <Text>
                            {`<${data.assetMasterTbl.quantity || '0'}> <${data.assetMasterTbl.uom || 'Unit'} >`}
                        </Text>
                    </View>
                </View >
            </View>
        )
    },

    {
        customQtyField: () => data.quantity,
    },
];


const secondStep = (detailData) => ({
    listItems: {
        listData: detailData.assetTrackingDetailVOs || [],
        beforeLineItem: {
            view: (item) => (
                <View style={styles.assetTransferNoContent}>

                    <Text style={styles.textAssetTransfer}>
                        Asset Transfer No.: {item.assetTransferNo}
                    </Text>
                    <View style={styles.assetTransferBranchContent}>
                        <Text style={styles.textAssetTransferBranch}>From {item.branchNameFrom || '<Branch Name>'} to {item.branchNameTo || '<Branch Name>'}</Text>
                    </View>
                </View>

            )
        },
        lineItem: {
            view: (item, index) => (
                <View id={index} style={styles.mappingContent}>
                    {item.assetTrackingTranferDetailVOs && item.assetTrackingTranferDetailVOs.map((i, indexChild) => (
                        <View>
                            <ItemImageList
                                key={indexChild}
                                itemData={i}
                                informationList={informationList(i)}
                            />

                            <Text
                                style={[styles.textStatus, statusColor(i.confirmed === 1 ? statusConst.status.confirmed : statusConst.status.unconfirmed)]}>
                                {i.confirmed === NumberConstant.statusConfirm ? statusConst.status.confirmed : statusConst.status.unconfirmed}
                            </Text>
                        </View>
                    )
                    )}
                </View>
            )
        },
    }
});

const statusColor = (status) => {
    switch (status) {
        case statusConst.status.confirmed:
            return styles.textConfirmed;
            break;
        case statusConst.status.unconfirmed:
            return styles.textUnConfirmed;
            break;
        default:
            break;
    }
};


