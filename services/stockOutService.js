import {apiService} from './apiService';
import {PATHS} from './service.config';
import {createFilterPath, getTypeHhaction} from '../utils/serviceFunctions';

export const stockOutService = {
  getPartReturnList,
  filterPartReturn,
  savePartReturn,
  createPartsReturn,
  getTransferOutList,
  filterTransferOut,
  saveTransferOut,
  getIssuesServiceList,
  filterIssuesService,
  saveIssuesService,
};

//Parts Return
async function getPartReturnList() {
  const path = await createFilterPath({
    path: PATHS.getPartReturnList,
    filterFields: {},
    fromPartReturn: true,
  });

  return apiService.get(path);
}

async function filterPartReturn(filterFields) {
  const path = await createFilterPath({
    path: PATHS.filterPartReturn,
    filterFields,
    fromPartReturn: true,
  });

  return apiService.get(path);
}

function savePartReturn(data) {
  const body = {d: data};
  const headers = {
    'Sap-Hhaction': getTypeHhaction(data.Hh_Doc),
  };

  return apiService.post(PATHS.savePartReturn, body, headers);
}

function createPartsReturn(data) {
  const body = {d: data};
  const headers = {
    'Sap-Hhaction': getTypeHhaction(data.Hh_Doc),
  };

  return apiService.post(PATHS.createPartsReturn, body, headers);
}

// Transfer Out
async function getTransferOutList() {
  const path = await createFilterPath({
    path: PATHS.getTransferOutList,
    filterFields: {},
  });

  return apiService.get(path);
}

async function filterTransferOut(filterFields) {
  const path = await createFilterPath({
    path: PATHS.filterTransferOut,
    filterFields,
  });

  return apiService.get(path);
}

function saveTransferOut(data) {
  const body = {d: data};
  const headers = {
    'Sap-Hhaction': getTypeHhaction(data.Hh_Doc),
  };

  return apiService.post(PATHS.saveTransferOut, body, headers);
}

// Issues Service
async function getIssuesServiceList() {
  const path = await createFilterPath({
    path: PATHS.getIssuesServiceList,
    filterFields: {},
  });

  return apiService.get(path);
}

async function filterIssuesService(filterFields) {
  const path = await createFilterPath({
    path: PATHS.filterIssuesService,
    filterFields,
  });

  return apiService.get(path);
}

function saveIssuesService(data) {
  const body = {d: data};
  const headers = {
    'Sap-Hhaction': getTypeHhaction(data.Hh_Doc),
  };

  return apiService.post(PATHS.saveIssuesService, body, headers);
}
