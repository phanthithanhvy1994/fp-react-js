import apiService from './apiService';
import {API_PATHS} from './service.config';

class GoodsReceiptService {
  getBranchByUser() {
    return apiService.makeRequest('post', API_PATHS.getBranch, {});
  }

  getGoodsReceiptList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getGoodsReceiptList,
      {},
      {},
      param,
    );
  }

  reSubmitGoodsReceiptWithDetails(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.reSubmitGoodsReceiptWithDetails,
      {},
      {},
      param,
    );
  }

  getGRType() {
    return apiService.makeRequest('get', API_PATHS.getGRType);
  }

  getGRStatus(param) {
    return apiService.makeRequest('get', API_PATHS.getGRStatus, param);
  }

  getGRVendor(param) {
    return apiService.makeRequest('post', API_PATHS.getGRVendor, param || {});
  }

  saveGoodsReceipt(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.saveGoodsReceipt,
      {},
      {},
      param,
    );
  }

  submitGoodsReceipt(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.submitGoodsReceipt,
      {},
      {},
      param,
    );
  }

  uploadGRImages(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.uploadGRImages,
      {},
      {},
      body,
    );
  }

  deleteGoodsReceipt(id) {
    return apiService.makeRequest(
      'post',
      API_PATHS.deleteGoodsReceipt,
      {},
      {},
      id,
    );
  }

  cancelGoodsReceipt(id) {
    return apiService.makeRequest(
      'post',
      API_PATHS.cancelGoodsReceipt,
      {},
      {},
      id,
    );
  }

  getGRScanningData(id) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getGRScanningData,
      {},
      {},
      id,
    );
  }

  getDataDOById(param) {
    return apiService.makeRequest('get', API_PATHS.getDataDOById, param);
  }

  getDataPOById(param) {
    return apiService.makeRequest('get', API_PATHS.getDataPOById, param);
  }

  updateGoodsReceipt(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.updateGoodsReceipt,
      {},
      {},
      params,
    );
  }

  editGoodsReceipt(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.editGoodsReceipt,
      {},
      {},
      params,
    );
  }

  getGRDeliveryType(param) {
    return apiService.makeRequest('get', API_PATHS.getGRDeliveryType, param);
  }

  editGoodsReceipt(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.editGoodsReceipt,
      {},
      {},
      params,
    );
  }

  // Service Detail Page

  getGoodsReceiptDetailsById(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getGoodsReceiptDetailsById,
      param,
    );
  }

  loadHistoryListData(id) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getGRHistoryData,
      {},
      {},
      id,
    );
  }

  addHistoryData(params) {
    const historyListData = [
      {time: new Date(), note: 'test note 1'},
      {time: new Date(), note: 'test note 2'},
      {time: new Date(), note: 'test note 3'},
    ];

    const historyData = {
      time: new Date(),
      note: params,
    };

    historyListData.unshift(historyData);

    return Promise.resolve(historyListData);
  }
}

export default new GoodsReceiptService();
