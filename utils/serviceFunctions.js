import {searchWithPK} from '../services/database/Search';
import {tableConstant} from '../database/Constant';
import split from 'lodash/split';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';
import {NumberOfDocumentsFromSAP as NUM_DOC} from '../constants/constants';
import {FILTER_EQUAL_PATH, FILTER_LIKE_PATH} from '../services/service.config';
import get from 'lodash/get';
import replace from 'lodash/replace';
import moment from 'moment';
import startsWith from 'lodash/startsWith';
import endsWith from 'lodash/endsWith';

export const getTypeHhaction = hhDoc => {
  const hhaction = startsWith(hhDoc, 'T') ? 'I' : 'U';
  return hhaction;
};

export const createFilterPath = async data => {
  let {filterFields, path, fromPartReturn} = data;
  const numDoc = await searchWithPK(tableConstant.name.CONFIG, 'NumDocSAP');
  const numDocValue = get(numDoc, 'value', NUM_DOC.defaultDocuments);
  path = replace(path, '{Num_Doc}', numDocValue);

  if (filterFields.withoutHhDoc) {
    filterFields.Hh_Doc = 'T*';
    delete filterFields.withoutHhDoc;
  }

  if (fromPartReturn) {
    if (isEmpty(filterFields.Hh_CreateDate)) {
      filterFields.Hh_CreateDate = {
        from: moment(new Date()).subtract(30, 'days'),
        to: moment(),
      };
    }
  } else {
    if (isEmpty(filterFields.Sap_DocDate)) {
      filterFields.Sap_DocDate = {
        from: moment(new Date()).subtract(30, 'days'),
        to: moment(),
      };
    }
  }

  return reduce(
    filterFields,
    (result, value, key) => {
      let pathWithValue = '';

      if (key === 'Sap_DocDate' || key === 'Hh_CreateDate') {
        pathWithValue = getPathSapDocDate(value, key);
      } else {
        var regexValue = (value || '').replace(/(?:\*)+/g, '*');
        const numberOfStar = (regexValue.match(/\*/g) || []).length;
        let method = 'substringof';
        if (numberOfStar === 0) {
          method = 'eq';
        }
        if (numberOfStar === 2) {
          method = 'substringof';
        }
        if (numberOfStar === 1) {
          if (value.length === 1) {
            return result;
          } else {
            if (startsWith(value, '*')) {
              method = 'endswith';
            } else if (endsWith(value, '*')) {
              method = 'startswith';
            } else {
              const subValue = split(value, '*');
              return `${result} and (endswith(${key}, '${
                subValue[0]
              }') and startswith(${key}, '${subValue[1]}'))`;
            }
          }
        }

        value = value.length === 1 ? value : value.replace(/\*/g, '');

        pathWithValue =
          (method === 'eq' ? '' : method) +
          replaceNthOccurrence(
            methodFilter[method].path[key],
            key,
            value,
            methodFilter[method].indexReplace,
          );
      }
      return `${result} and ${pathWithValue}`;
    },
    path,
  );
};

const methodFilter = {
  substringof: {
    path: FILTER_LIKE_PATH,
    indexReplace: 1,
  },
  eq: {path: FILTER_EQUAL_PATH, indexReplace: 2},
  endswith: {
    path: FILTER_LIKE_PATH,
    indexReplace: 2,
  },
  startswith: {
    path: FILTER_LIKE_PATH,
    indexReplace: 2,
  },
};

const formatDate = 'YYYY-MM-DD[T00:00:00]';

const replaceNthOccurrence = (string, subString, value, nth) => {
  let index = 0;
  const regex = new RegExp(subString, 'g');
  const stringReplaced = string.replace(regex, function(match) {
    index++;
    return index === nth ? `'${value}'` : match;
  });
  return stringReplaced;
};

const getPathSapDocDate = (value, key) => {
  let pathWithValue = replace(
    FILTER_EQUAL_PATH[key],
    '{Sap_DocDate_From}',
    moment(value.from).format(formatDate),
  );
  pathWithValue = replace(
    pathWithValue,
    '{Sap_DocDate_To}',
    moment(value.to).format(formatDate),
  );
  return pathWithValue;
};
