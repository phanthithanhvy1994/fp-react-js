import goodsReceiptService from '../services/goods-receipt-service';

export function getGoodsReceiptList(body) {
  return goodsReceiptService.getGoodsReceiptList(body).then(res => res);
}

export function reSubmitGoodsReceiptWithDetails(body) {
  return goodsReceiptService
    .reSubmitGoodsReceiptWithDetails(body)
    .then(res => res);
}

export function getBranchByUser(userId) {
  return goodsReceiptService.getBranchByUser(userId).then(res => res);
}

export function getGRStatus() {
  return goodsReceiptService.getGRStatus();
}

export function getGRType() {
  return goodsReceiptService.getGRType();
}

export function getGRVendor(body) {
  return goodsReceiptService.getGRVendor(body).then(res => res);
}

export function deleteGoodsReceipt(body) {
  return goodsReceiptService.deleteGoodsReceipt(body).then(res => res);
}

export function cancelGoodsReceipt(body) {
  return goodsReceiptService.cancelGoodsReceipt(body).then(res => res);
}

export function submitGoodsReceipt(body) {
  return goodsReceiptService.submitGoodsReceipt(body).then(res => res);
}

export function uploadGRImages(body) {
  return goodsReceiptService.uploadGRImages(body);
}

export function getGRScanningData(body) {
  return goodsReceiptService.getGRScanningData(body).then(res => res);
}

export function saveGoodsReceipt(body) {
  return goodsReceiptService.saveGoodsReceipt(body).then(res => res);
}
export function updateGoodsReceipt(body) {
  return goodsReceiptService.updateGoodsReceipt(body).then(res => res);
}

export function getGRDeliveryType() {
  return goodsReceiptService.getGRDeliveryType().then(res => res);
}

export function getDataDOById(body) {
  return goodsReceiptService.getDataDOById(body).then(res => res);
}

export function getDataPOById(body) {
  return goodsReceiptService.getDataPOById(body).then(res => res);
}

export function editGoodsReceipt(body) {
  return goodsReceiptService.editGoodsReceipt(body).then(res => res);
}

// Use for details page
export function getGoodsReceiptDetailsById(body) {
  return goodsReceiptService.getGoodsReceiptDetailsById(body).then(res => res);
}

// Use for history section
export function loadHistoryListData(id) {
  return goodsReceiptService.loadHistoryListData(id).then(res => res);
}

export function addHistoryData(params) {
  return goodsReceiptService.addHistoryData(params);
}
