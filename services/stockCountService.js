import {apiService} from './apiService';
import {PATHS, FILTER_PATH_STOCK_COUNT} from './service.config';
import {createFilterPath, getTypeHhaction} from '../utils/serviceFunctions';

export const stockCountService = {
  getStockCountList,
  filterStockCount,
  saveStockCount,
  getRandomStockList,
  filterRandomStock,
  saveRandomStock,
  getStockCountRecountList,
  filterStockCountRecount,
  saveStockCountRecount,
};

// Random Stock Count
async function getRandomStockList() {
  const path = await createFilterPath({
    FILTER_PATH: FILTER_PATH_STOCK_COUNT,
    path: PATHS.getRandomStockList,
    filterFields: {},
  });
  return apiService.get(path);
}

async function filterRandomStock(filterFields) {
  const path = await createFilterPath({
    FILTER_PATH: FILTER_PATH_STOCK_COUNT,
    path: PATHS.filterRandomStock,
    filterFields,
  });
  return apiService.get(path);
}

function saveRandomStock(data) {
  const body = {d: data};
  const headers = {
    'Sap-Hhaction': getTypeHhaction(data.Hh_Doc),
  };

  return apiService.post(PATHS.saveRandomStock, body, headers);
}

// Stock count
async function getStockCountList() {
  const path = await createFilterPath({
    FILTER_PATH: FILTER_PATH_STOCK_COUNT,
    path: PATHS.getStockCountList,
    filterFields: {},
  });
  return apiService.get(path);
}

async function filterStockCount(filterFields) {
  const path = await createFilterPath({
    FILTER_PATH: FILTER_PATH_STOCK_COUNT,
    path: PATHS.filterStockCount,
    filterFields,
  });
  return apiService.get(path);
}

function saveStockCount(data) {
  const body = {d: data};
  const headers = {
    'Sap-Hhaction': getTypeHhaction(data.Hh_Doc),
  };
  return apiService.post(PATHS.saveStockCount, body, headers);
}

// Stock count recount
async function getStockCountRecountList() {
  const path = await createFilterPath({
    FILTER_PATH: FILTER_PATH_STOCK_COUNT,
    path: PATHS.getStockCountRecountList,
    filterFields: {},
  });
  return apiService.get(path);
}

async function filterStockCountRecount(filterFields) {
  const path = await createFilterPath({
    FILTER_PATH: FILTER_PATH_STOCK_COUNT,
    path: PATHS.filterStockCountRecount,
    filterFields,
  });
  return apiService.get(path);
}

function saveStockCountRecount(data) {
  const body = {d: data};
  const headers = {
    'Sap-Hhaction': getTypeHhaction(data.Hh_Doc),
  };
  return apiService.post(PATHS.saveStockCountRecount, body, headers);
}
