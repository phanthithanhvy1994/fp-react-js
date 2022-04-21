import {apiService} from './apiService';
import {PATHS} from './service.config';
import {Base64} from 'js-base64';

import {searchWithPK} from '../services/database/Search';

import {tableConstant} from '../database/Constant';
import {databaseDefine} from '../constants/constants';

export const userService = {
  loginGetPermission,
  login,
  logout,
};

async function loginGetPermission(username, password) {
  let path = PATHS.login.replace('{Uname}', username.toUpperCase());
  // [HONDAIPB-Fixbug] - 17/09/2020 - Login not working (Impact by issue Data not sync when re-open dialog)
  const SAPClient = await searchWithPK(tableConstant.name.CONFIG, databaseDefine.configSAPClient.name);

  if (SAPClient.value) {
    path = path.replace('{sap-client}', SAPClient.value);
  }

  const header = {
    Authorization: `Basic ${Base64.encode(`${username}:${password}`)}`,
  };

  return apiService.get(path, '', header);
}

async function login(username, password) {
  let path = PATHS.login.replace('{Uname}', username.toUpperCase());
  // [HONDAIPB-Fixbug] - 17/09/2020 - Login not working (Impact by issue Data not sync when re-open dialog)
  const SAPClient = await searchWithPK(tableConstant.name.CONFIG, databaseDefine.configSAPClient.name);
  if (SAPClient.value) {
    path = path.replace('{sap-client}', SAPClient.value);
  }

  const header = {
    Authorization: `Basic ${Base64.encode(`${username}:${password}`)}`,
    'X-CSRF-Token': 'fetch',
  };

  return apiService.get(path, '', header);
}

async function logout(username, password) {
  return apiService.get(PATHS.logout);
}
