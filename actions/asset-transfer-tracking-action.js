import assetTransferTrackingService from '../services/asset-transfer-tracking-service';

export function getAssetTrackingList(body) {
  return assetTransferTrackingService.getAssetTrackingList(body);
}

export function deleteAssetTracking(body) {
  return assetTransferTrackingService.deleteAssetTracking(body);
}

export function getAssetTrackingDetail(body) {
  return assetTransferTrackingService.getAssetTrackingDetail(body);
}

export function saveAssetTracking(body, typeSubmit) {
  return assetTransferTrackingService.saveAssetTracking(body, typeSubmit);
}

