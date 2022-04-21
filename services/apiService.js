import {trackPromise} from 'react-promise-tracker';
import axios from 'axios';
import {DOMAIN, DEF_HEADERS, HTTP_METHODS} from './service.config';
import {
  handleResponse,
  handleBeforeSendRequest,
  handleError,
} from '../actions/api-action';

const axiosInstance = axios.create({
  baseURL: DOMAIN,
});

// Interceptors
axiosInstance.interceptors.request.use(request =>
  handleBeforeSendRequest(request),
);

class ApiService {
  makeRequest(method, path = '', params = {}, headers = {}, body = {}) {
    const headersCombine = {...DEF_HEADERS, ...headers};
    let http;

    if (method === 'post' || method === 'put') {
      http = axiosInstance[HTTP_METHODS[method]](path, body, {
        headersCombine,
        params,
      });
    } else {
      http = axiosInstance[HTTP_METHODS[method]](path, {
        headersCombine,
        params,
      });
    }
    return trackPromise(
      http.then(handleResponse).catch(res => handleError(res)),
    );
  }
}

export default new ApiService();
