import { FieldConstant, dateFormat } from '../../../constants/constants';
import { formatDateString } from '../../../utils/date-util';

export const configStep = (detailData, isBranchPoType, secondStepView, thirstStepView) => ([
    firstStep(detailData, isBranchPoType),
    secondStep(secondStepView),
    thirstStep(thirstStepView),
]);

export const bottomActionNextBtnConfig = [];

const firstStep = (detailData, isBranchPoType) => {
    if (isBranchPoType) {
        return {
            fieldsArray: [
                {
                    id: 'type',
                    label: 'Type',
                    fieldName: 'type',
                    fieldType: FieldConstant.type.TEXT_ONLY,
                    value: (detailData && detailData.goodReceiptTypeName) || '',
                },
                {
                    id: 'branch',
                    label: 'Branch',
                    fieldName: 'branch',
                    fieldType: FieldConstant.type.TEXT_ONLY,
                    value: (detailData && detailData.branchName) || '',
                },
                {
                    id: 'vendor',
                    label: 'Vendor',
                    fieldName: 'vendor',
                    fieldType: FieldConstant.type.TEXT_ONLY,
                    value: (detailData && detailData.vendorName) || '',
                },
                {
                    id: 'submittedTime',
                    label: 'Submitted Time',
                    fieldName: 'submittedTime',
                    fieldType: FieldConstant.type.TEXT_ONLY,
                    value: (detailData && formatDateString(detailData.submittedTime, dateFormat.mainDateTime, true)) || '',
                },
                {
                    id: 'remainingTime',
                    label: 'Remaining Time',
                    fieldName: 'remainingTime',
                    fieldType: FieldConstant.type.TEXT_ONLY,
                    value: (detailData && formatDateString(detailData.remainingTime, dateFormat.time, true)) || '',
                },
                {
                    id: 'createdBy',
                    label: 'Created By',
                    fieldName: 'createdBy',
                    fieldType: FieldConstant.type.TEXT_ONLY,
                    value: (detailData && detailData.createdBy) || '',
                },
                {
                    id: 'materialDocument',
                    label: 'Material Document',
                    fieldName: 'materialDocument',
                    fieldType: FieldConstant.type.TEXT_ONLY,
                    value: (detailData && detailData.materialDocument) || '',
                },
                {
                    id: 'PO/DONo',
                    label: 'PO/DO No.',
                    fieldName: 'PO/DONo',
                    fieldType: FieldConstant.type.RECIPIENT,
                    iconName: 'qrcode-scan',
                    require: true,
                    disabled: true,
                    value: (detailData && detailData.poNumber) || '',
                },
                {
                    id: 'truckTemperature',
                    label: 'Truck Temperature',
                    fieldName: 'truckTemperature',
                    fieldType: FieldConstant.type.TEXT,
                    disabled: true,
                    value: (detailData && detailData.truckTemperature?.toString()) || '',
                },
                {
                    id: 'invoiceNo',
                    label: 'Invoice No./Delivery Note',
                    fieldName: 'invoiceNo',
                    fieldType: FieldConstant.type.TEXT,
                    require: true,
                    disabled: true,
                    value: (detailData && detailData.deliveryNote) || '',
                },
                {
                    id: 'note',
                    label: 'Note',
                    fieldName: 'note',
                    fieldType: FieldConstant.type.TEXT,
                    disabled: true,
                    value: (detailData && detailData.note) || '',
                },
            ]
        }
    } else {
        return {
            fieldsArray: [{
                id: 'type',
                label: 'Type',
                fieldName: 'type',
                fieldType: FieldConstant.type.TEXT_ONLY,
                value: (detailData && detailData.goodReceiptTypeName) || '',
            },
            {
                id: 'branch',
                label: 'Branch',
                fieldName: 'branch',
                fieldType: FieldConstant.type.TEXT_ONLY,
                value: (detailData && detailData.branchName) || '',
            },
            {
                id: 'factory',
                label: 'Factory',
                fieldName: 'factoryName',
                fieldType: FieldConstant.type.TEXT_ONLY,
                value: (detailData && detailData.factoryName) || '',
            },
            {
                id: 'poStoNumber',
                label: 'PO-STO No.',
                fieldName: 'poStoNumber',
                fieldType: FieldConstant.type.TEXT_ONLY,
                value: (detailData && detailData.poStoNumber) || '',
            },
            {
                id: 'submittedTime',
                label: 'Submitted Time',
                fieldName: 'submittedTime',
                fieldType: FieldConstant.type.TEXT_ONLY,
                value: (detailData && formatDateString(detailData.submittedTime, dateFormat.mainDateTime, true)) || '',
            },
            {
                id: 'remainingTime',
                label: 'Remaining Time',
                fieldName: 'remainingTime',
                fieldType: FieldConstant.type.TEXT_ONLY,
                value: (detailData && formatDateString(detailData.remainingTime, dateFormat.time, true)) || '',
            },
            {
                id: 'createdBy',
                label: 'Created By',
                fieldName: 'createdBy',
                fieldType: FieldConstant.type.TEXT_ONLY,
                value: (detailData && detailData.createdBy) || '',
            },
            {
                id: 'materialDocument',
                label: 'Material Document',
                fieldName: 'materialDocument',
                fieldType: FieldConstant.type.TEXT_ONLY,
                value: (detailData && detailData.materialDocument) || '',
            },
            {
                id: 'PO/DONo',
                label: 'PO/DO No.',
                fieldName: 'PO/DONo',
                fieldType: FieldConstant.type.RECIPIENT,
                iconName: 'qrcode-scan',
                require: true,
                disabled: true,
                value: (detailData && detailData.doNumber) || '',
            },
            {
                id: 'truckTemperature',
                label: 'Truck Temperature',
                fieldName: 'truckTemperature',
                fieldType: FieldConstant.type.TEXT,
                require: true,
                disabled: true,
                value: (detailData && detailData?.truckTemperature?.toString()) || '',
            },
            {
                id: 'note',
                label: 'Note',
                fieldName: 'note',
                fieldType: FieldConstant.type.TEXT,
                disabled: true,
                value: (detailData && detailData.note) || '',
            },]
        }
    }
};

const secondStep = (secondStepView) => ({
    customView: {
        view: () => secondStepView ? secondStepView : null
    },
});

const thirstStep = (thirstStepView) => ({
    customView: {
        view: () => thirstStepView ? thirstStepView : null
    },
});

const lastViewFields = (temperatureOfItemsData, isBranchPoType) => [
    {
        id: 'productTemperature1',
        label: 'Product Temperature 1',
        fieldName: 'productTemperature1',
        fieldType: FieldConstant.type.SELECT,
        disabled: true,
        require: !isBranchPoType,
        data: [{ value: temperatureOfItemsData.producTemp1, display: temperatureOfItemsData.producTemp1 }],
        value: temperatureOfItemsData.producTemp1
    },
    {
        id: 'productTemperature2',
        label: 'Product Temperature 2',
        fieldName: 'productTemperature2',
        fieldType: FieldConstant.type.SELECT,
        disabled: true,
        require: false,
        data: [{ value: temperatureOfItemsData.producTemp2, display: temperatureOfItemsData.producTemp2 }],
        value: temperatureOfItemsData.producTemp2
    },
    {
        id: 'productTemperature3',
        label: 'Product Temperature 3',
        fieldName: 'productTemperature3',
        fieldType: FieldConstant.type.SELECT,
        disabled: true,
        require: false,
        data: [{ value: temperatureOfItemsData.producTemp3, display: temperatureOfItemsData.producTemp3 }],
        value: temperatureOfItemsData.producTemp3
    },
];

const attachedImagesField = attachedImagesData => {
    return [
        {
            label: '',
            id: 'attachedImages',
            fieldType: FieldConstant.type.UPLOAD_IMAGE,
            disableUpload: true,
            imgArr: [...attachedImagesData] || [],
        },
    ];
}

const deliveryTypeField = itemData => [
    {
        id: 'overDelivery',
        label: '',
        fieldName: 'overDelivery',
        fieldType: FieldConstant.type.SELECT,
        disabled: true,
        data: [{ value: itemData.deliveryType, display: itemData.deliveryTypeName }],
    },
];


export { lastViewFields, deliveryTypeField, attachedImagesField };
