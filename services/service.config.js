const DOMAIN = 'http://147.50.130.88:8080/FlexBA-RMS_WebServices/';
// const DOMAIN = 'http://taytran2015:8080/FlexBA-RMS_WebServices/';
// const DOMAIN = 'http://172.18.4.37:8080/FlexBA-RMS_WebServices/';

const STATUS = {
  success: '200',
  badRequest: '400',
  unauthorizedAccess: '401',
  accessDenied: '403',
  notFound: '404',
  serverError: '500',
  serverErrorValue: 500,
};
const API_PATHS = {
  //Common
  getBranch: '/services/branch/search',
  // GR
  getBranchCode: '/services/master/counter_brand/get_all',
  getGoodsReceiptList: '/services/purchase/goods_receipt/search',
  getGoodsReceiptDetailsById: '/services/purchase/goods_receipt/get',
  getGRVendor: '/services/vendor/search_combo',
  getGRStatus:
    '/services/master/type/get_by_class?typeClass=GOOD_RECEIPT_STATUS',
  getGRType: '/services/master/type/get_by_class?typeClass=GOODS_RECEIPT_TYPE',
  getGRHistoryData: '/services/purchase/goods_receipt_history/search',
  deleteGoodsReceipt: '/services/purchase/goods_receipt/delete',
  cancelGoodsReceipt: '/services/purchase/goods_receipt/cancel',
  getGRScanningData: '/services/purchase/goods_receipt/scan',
  saveGoodsReceipt: '/services/purchase/goods_receipt/add',
  submitGoodsReceipt: '/services/purchase/goods_receipt/submit',
  reSubmitGoodsReceiptWithDetails: '/services/purchase/goods_receipt/resubmit',
  uploadGRImages: '/api/v1/goods_receipt/upload_file',
  getDataPOById: '/services/purchase/po_request/get',
  getDataDOById: '/services/sales/do/detail',
  updateGoodsReceipt: '/services/purchase/goods_receipt/update',
  getGRDeliveryType:
    '/services/master/type/get_by_class?typeClass=GOOD_RECEIPT_DELIVERY_TYPE',
  editGoodsReceipt: '/services/purchase/goods_receipt/edit',

  // Asset Transfer
  getAssetTransferList: '/services/asset_transfer/search',
  getAssetTransferByID: '/services/asset_transfer/get?id=@assetTransferId',
  loadAssetTransferStatus: '/services/master/type/get_combo_by_class?typeClass=ASSET_TRANSFER_STATUS',
  deleteAssetTransfer: '/services/asset_transfer/delete?id=@assetTransferId',
  cancelAssetTransfer: '/services/asset_transfer/cancel?id=@assetTransferId',
  getASTType:
    '/services/master/type/get_by_class?typeClass=ASSET_TRANSFER_TYPE',
  getASTDestination: '/services/master/asset_transfer/type',
  scanARData: '/services/asset_transfer/scan_asset_request',
  assetTransferFromTo: '/services/asset_location/search',
  insertATData: '/services/asset_transfer/insert',
  updateATData: '/services/asset_transfer/insert',
  getATData: '/services/asset_transfer/get',
  loadAssetTransferDetail: '/services/asset_transfer/transfer_no_get',
  scanAssetMaster: '/services/asset_transfer/scan',

  // Asset Transfer Tracking
  getAssetTrackingList: '/services/asset_tracking/search',
  deleteAssetTracking: '/services/asset_tracking/delete',
  getAssetTrackingDetail: '/services/asset_tracking/get',
  saveAssetTracking: 'services/asset_tracking/save',
  confirmAssetTracking: 'services/asset_tracking/confirm',
};

const DEF_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const HTTP_METHODS = {
  post: 'post',
  get: 'get',
  put: 'put',
  delete: 'delete',
};
export { DOMAIN, STATUS, API_PATHS, DEF_HEADERS, HTTP_METHODS };
