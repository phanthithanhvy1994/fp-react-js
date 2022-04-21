import {apiService} from './apiService';
import {PATHS, FILTER_PATH} from './service.config';
import {createFilterPath, getTypeHhaction} from '../utils/serviceFunctions';

export const stockInService = {
  getPurchasingList,
  filterPurchasings,
  savePurchasing,
  getReturnSaleList,
  filterReturnSales,
  saveReturnSale,
  getTransferInList,
  filterTransferIn,
  saveTransferIn,
};

//Receive from Purchasing
async function getPurchasingList() {
  const path = await createFilterPath({
    path: PATHS.getPurchasingList,
    filterFields: {},
  });
  return apiService.get(path);
}

async function filterPurchasings(filterFields) {
  const path = await createFilterPath({
    path: PATHS.filterPurchasings,
    filterFields,
  });
  return apiService.get(path);
}

function savePurchasing(data) {
  const body = {d: data};
  const headers = {
    'Sap-Hhaction': getTypeHhaction(data.Hh_Doc),
  };

  return apiService.post(PATHS.savePurchasing, body, headers);
}

// Return from Service / Sales
async function getReturnSaleList() {
  const path = await createFilterPath({
    FILTER_PATH,
    path: PATHS.getReturnSaleList,
    filterFields: {},
  });
  return apiService.get(path);
}

async function filterReturnSales(filterFields) {
  const path = await createFilterPath({
    FILTER_PATH,
    path: PATHS.filterReturnSales,
    filterFields,
  });
  return apiService.get(path);
}

function saveReturnSale(data) {
  const body = {d: data};
  const headers = {
    'Sap-Hhaction': getTypeHhaction(data.Hh_Doc),
  };

  return apiService.post(PATHS.saveReturnSale, body, headers);
}

//Transfer In
async function getTransferInList() {
  const path = await createFilterPath({
    FILTER_PATH,
    path: PATHS.getTransferInList,
    filterFields: {},
  });
  return apiService.get(path);
}

async function filterTransferIn(filterFields) {
  const path = await createFilterPath({
    FILTER_PATH,
    path: PATHS.filterTransferIn,
    filterFields,
  });
  return apiService.get(path);
}

function saveTransferIn(data) {
  const body = {d: data};
  const headers = {
    'Sap-Hhaction': getTypeHhaction(data.Hh_Doc),
  };
  return apiService.post(PATHS.saveTransferIn, body, headers);
}
