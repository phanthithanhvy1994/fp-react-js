import apiService from './apiService';
import {API_PATHS} from './service.config';

class CommonService {
  getBranchByUser() {
    return apiService.makeRequest('post', API_PATHS.getBranch, {});
    // return Promise.resolve({
    //   status: 200,
    //     data: [{
    //       value: '1',
    //       display: 'branch1'
    //     },{
    //       value: '2',
    //       display: 'branch2'
    //     }]
    // });
  }

  getAssetLocation(params) {
    return apiService.makeRequest('post', API_PATHS.assetTransferFromTo, {}, {}, params);
  //   return Promise.resolve({
  //     data: [{
  //       assetLocationCode: 'B001',
  //       assetLocationName: 'location1'
  //     },{
  //       assetLocationCode: 'B002',
  //       assetLocationName: 'location2'
  //     }, {
  //       assetLocationCode: 'B003',
  //       assetLocationName: 'location3'
  //     }]
  // });
  }
}

export default new CommonService();