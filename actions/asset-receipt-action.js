import assetReceiptService from '../services/asset-receipt-service';

export function getAssetReceiptList(params) {
    return  assetReceiptService.getAssetReceiptList(params).then(res => res);
}

export function getAssetReceiptDetailById(params) {
    return  assetReceiptService.getAssetReceiptDetailById(params).then(res => res);
}