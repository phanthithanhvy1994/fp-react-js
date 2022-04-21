import assetTransferService from '../services/asset-transfer-service';

export function getAssetTransferList(body) {
  return assetTransferService.getAssetTransferList(body).then(res => res);
}

export function deleteAssetTransfer(body) {
  return assetTransferService.deleteAssetTransfer(body).then(res => res);
}

export function cancelAssetTransfer(body) {
  return assetTransferService.cancelAssetTransfer(body).then(res => res);
}

// Use for details page
export function getAssetTransferDetailsById(body) {
  return assetTransferService.getAssetTransferDetailsById(body).then(res => res);
}

export function loadAssetTransferStatus() {
  return assetTransferService.loadAssetTransferStatus().then(res => res);
}

export function loadAssetTransferDestination() {
  return assetTransferService.loadAssetTransferDestination();
}

export function loadAssetTransferLocation() {
  return assetTransferService.loadAssetTransferLocation();
}

export function getASTType(params) {
  return assetTransferService.getType(params).then(res => res);
}

export function getDestination(params) {
  return assetTransferService.getDestination(params).then(res => res);
}

export function loadARData(params) {
  return assetTransferService.loadARData(params).then(res => res);
}

export function loadATransData(params) {
  return assetTransferService.loadATransData(params).then(res => res);
}

export function loadATData(params) {
  return assetTransferService.loadATData(params).then(res => res);
}

export function saveATData(params) {
  return assetTransferService.saveATData(params).then(res => res);
}

export function getDataScanning(params) {
  return assetTransferService.getDataScanning(params).then(res => res);
}

export function loadAssetTransferDetail(params) {
  return assetTransferService.loadAssetTransferDetail(params);
}