import { formatDateString } from '../../../utils/date-util';
import { dateFormat } from '../../../constants/constants';

/**
 * @param {Object} params
 * @param {Object} searchArray
 * @param {string} property The property want to check whether add it to params if any value
 */
export const mapPropertyForRequestParams = (
  params,
  searchArray,
  property,
  propertyCustom,
) => {
  const requestParams = params;

  if (searchArray[property] && searchArray[property].length > 0) {
    requestParams[propertyCustom ? propertyCustom : property] = {
      in: searchArray[property].map(el => el.value),
    };
  }
  return requestParams;
};

/**
 * @param {Object} params
 * @param {Array} searchArray
 * @param {string} property The property want to check whether add it to params if any value
 */
export const setPropertyForRequestParams = (
  params,
  searchArray,
  property,
  propertyCustom,
) => {
  const requestParams = params;

  if (searchArray[property]) {
    requestParams[propertyCustom ? propertyCustom : property] = {
      like:
        typeof searchArray[property] === 'string'
          ? searchArray[property].trim()
          : searchArray[property],
    };
  }
  return requestParams;
};

/**
 * @param {Object} params
 * @param {Array} searchArray
 * @param {string} property The property want to check whether add it to params if any value
 * @param {string} mappingProperties The property want to update
 */
export const updatePropertyForRequestParams = (
  params,
  searchArray,
  property,
  updatedProperties,
) => {
  const requestParams = params;

  if (updatedProperties && searchArray[property]) {
    requestParams[updatedProperties] = {
      like: searchArray[property],
    };
  }
  return requestParams;
};

/**
 * @param {Object} params
 * @param {Array} searchArray
 * @param {string} property The property of date range field want to check
 */
export const setDateRangeRequestParams = (params, searchArray, property) => {
  const requestParams = params;
  if (searchArray[property] && searchArray[property].from) {
    let date = searchArray[property].from;
    // if (date.toLocaleDateString) {
    //   date = date.toLocaleDateString();
    // }

    requestParams[`${property}From`] = {
      ge: formatDateString(date, dateFormat.savingDateTimeStartDate),
    };
  }
  if (searchArray[property] && searchArray[property].to) {
    let date = searchArray[property].to;
    // if (date.toLocaleDateString) {
    //   date = date.toLocaleDateString();
    // }

    requestParams[`${property}To`] = {
      le: formatDateString(date, dateFormat.savingDateTimeEndDate),
    };
  }
  return requestParams;
};
