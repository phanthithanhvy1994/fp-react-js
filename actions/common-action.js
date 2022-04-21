import commonService from '../services/commonService';

export function getBranchByUser(userId) {
  return commonService.getBranchByUser(userId).then(res => res);
}

export function getAssetLocation(params) {
  return commonService.getAssetLocation(params).then(res => res);
}
