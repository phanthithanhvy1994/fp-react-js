import { Action } from '../constants/constants';
import apiService from './apiService';
import { API_PATHS } from './service.config';

class assetTransferService {
  getAssetTrackingList(param) {
    return apiService.makeRequest('post', API_PATHS.getAssetTrackingList, {}, {}, param);
  }

  deleteAssetTracking(param) {
    return apiService.makeRequest('post', API_PATHS.deleteAssetTracking, {}, {}, param);
  }

  getAssetTrackingDetail(param) {
    return apiService.makeRequest('get', API_PATHS.getAssetTrackingDetail, param);
  }

  saveAssetTracking(param, typeSubmit) {
    const path = (typeSubmit === Action.save) ? API_PATHS.saveAssetTracking : API_PATHS.confirmAssetTracking;

    return apiService.makeRequest(
      'post',
      path,
      {},
      {},
      param
    );
  }
}

export default new assetTransferService();
