import moment from 'moment';
import { dateFormat } from '../constants/constants';

export const formatDateString = (dateString, format, isSplit = false) => {
  const convertFormat = format || dateFormat.mainDateTime;
  // The datetime string return from server is same this one : '20201112000000'
  // Set isSplit to true to split the above string and convert dateformat
  const date =
    dateString &&
    (isSplit && dateString.length === 14
      ? `${dateString.substring(0, 8)} ${dateString.substring(8, 14)}`
      : dateString);
  return (date && moment(date).format(convertFormat)) || '';
};

export const covertStringToDate = (date, convertFormat) => {
  return (date && moment(date, convertFormat).toDate()) || '';
};

/**
 * Convert from object or string to date string
 */
export const convertToDateString = (date, format, isSplit = false) => {
  // Data return from server will be '20201112000000', should split it to format correctly
  const shouldSplit = !!(
    typeof date === 'string' && date.match(dateFormat.serverFormatRegex)
  );

  return (
    (date &&
      formatDateString(
        typeof date === 'object' ? date.toLocaleDateString() : date,
        format || dateFormat.savingDateTime,
        isSplit || shouldSplit,
      )) ||
    ''
  );
};

/**
 * Convert submitted time to render step time
 */
export const convertSubmittedTime = date => {
  // Data return from server will be '20201112113020', should split it to format 11:30:20
  const hours = date?.substring(8, 10);
  const minute = date?.substring(10, 12);
  const second = date?.substring(12, 14);

  return `${hours}:${minute}:${second}`;
};

export const convertToServerFormat = date => {
  const isSeverFormat = !!(
    typeof date === 'string' && date.match(dateFormat.serverFormatRegex)
  );
  return isSeverFormat ? date : formatDateString(date, dateFormat.savingDateTime);
}
