import get from 'lodash/get';
import includes from 'lodash/includes';

import { MESSAGE } from '../constants/message';
import { STATUS } from '../constants/constants';
import { showDialog } from '../utils/functions';

export function handleError(response) {
  const error = get(response, 'data.message', MESSAGE.ERROR_SYSTEM);
  // The error should be handle by catch function, so the following handler is marked as commment
  // showDialog({ content: [MESSAGE.ERROR_SYSTEM] });
  return Promise.reject(error);
}

export function handleResponse(response) {
  const status = get(
    response,
    'data.status',
    STATUS.serverErrorValue,
  ).toString();
  return new Promise((resolve, reject) => {
    if (status !== STATUS.success && status !== STATUS.badRequest) {
      if (includes([STATUS.accessDenied, STATUS.unauthorizedAccess], status)) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        // authenticationService.logout();
      }
      reject(response);
    } else {
      resolve(response.data);
    }
  });
}

export function handleBeforeSendRequest(request) {
  return request;
}
