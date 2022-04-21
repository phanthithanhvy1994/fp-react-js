import {searchWithTrxType} from '../../services/database/Search';
import {forEach} from 'lodash';
import {convertObjToArray, deepCopy} from '../../utils/functions';

export const sapDocTitle = {
  // [#HONDAIPB-CR] - 09/07/2020 - Change label
  I_PURCHASE: 'Tax Invoice No.',
  I_SALESRTN: 'Return No.',
  I_TRANSFER: 'Unpacking (TRF) No.',
  O_CLAIM: 'Ref. Receipt',
  O_SALES: 'Packing No.',
  O_TRANSFER: 'Packing (TRF) No.',
  C_RANDOM: 'Random Count No.',
  C_NORMAL: 'Count Document No.',
  C_RECOUNT: 'Count Document No.',
};

export const unfinishedDocs = [
  {
    title: 'Receive from Purchasing',
    items: [],
  },
  {
    title: 'Return from Service / Sales',
    items: [],
  },
  {
    title: 'Transfer In',
    items: [],
  },
  {
    title: 'Parts Return',
    items: [],
  },
  {
    title: 'Parts Return to APC - Create',
    items: [],
  },
  {
    title: 'Issue for Service / Sales',
    items: [],
  },
  {
    title: 'Transfer Out',
    items: [],
  },
  {
    title: 'Unfinished Random Stock Count',
    items: [],
  },
  {
    title: 'Unfinished Stock Count',
    items: [],
  },
  {
    title: 'Stock Count Recount - List',
    items: [],
  },
];

export const screenList = [
  'purchaseList',
  'returnServiceList',
  'transferIn',
  'partReturnList',
  'partReturnCreateList',
  'issuesServiceList',
  'transferOutList',
  'randomStockCountList',
  'stockCountList',
  'stockCountRecountList',
];

const trxType = [
  'I_PURCHASE',
  'I_SALESRTN',
  'I_TRANSFER',
  'O_CLAIM',
  'O_SALES',
  'O_TRANSFER',
  'C_RANDOM',
  'C_NORMAL',
  'C_RECOUNT',
];

export const screenListDetail = {
  I_PURCHASE: 'ReceiveFromPurchasingDetail',
  I_SALESRTN: 'ReturnServiceDetail',
  I_TRANSFER: 'TransferInDetail',
  O_CLAIM: 'PartsReturnDetail',
  O_SALES: 'IssuesServiceDetail',
  O_TRANSFER: 'TransferOutDetail',
  C_RANDOM: 'RandomStockCountDetail',
  C_NORMAL: 'StockCountDetail',
  C_RECOUNT: 'StockCountRecountDetail',
};

export const getUnfinishedDocs = async () => {
  const res = await Promise.all(
    trxType.map(async trx => {
      return await searchWithTrxType(trx);
    }),
  );

  // DB return object => Convert object to array
  const purchaseList = convertObjToArray(deepCopy(res[0]));
  const returnServiceList = convertObjToArray(deepCopy(res[1]));
  const transferIn = convertObjToArray(deepCopy(res[2]));
  const originalPartReturn = convertObjToArray(deepCopy(res[3]));
  const issuesServiceList = convertObjToArray(deepCopy(res[4]));
  const transferOutList = convertObjToArray(deepCopy(res[5]));
  const randomStockCountList = convertObjToArray(deepCopy(res[6]));
  const stockCountList = convertObjToArray(deepCopy(res[7]));
  const stockCountRecountList = convertObjToArray(deepCopy(res[8]));

  // Parts return & add part return case
  const partReturnList = originalPartReturn.filter(part => !part.Hh_Subtitle);
  const partReturnCreateList = originalPartReturn.filter(
    part => part.Hh_Subtitle === 'O_CLAIM#Create',
  );

  const docList = {
    purchaseList: purchaseList,
    returnServiceList: returnServiceList,
    transferIn: transferIn,
    partReturnList: partReturnList,
    partReturnCreateList: partReturnCreateList,
    issuesServiceList: issuesServiceList,
    transferOutList: transferOutList,
    randomStockCountList: randomStockCountList,
    stockCountList: stockCountList,
    stockCountRecountList: stockCountRecountList,
  };

  let docs = unfinishedDocs;
  forEach(screenList, (screen, index) => {
    docs[index].items = docList[screen];
  });
  return docs;
};

export const countUnfinishedDocs = docs => {
  let number = 0;
  docs.map(doc => {
    number += doc.items.length;
  });
  return number;
};
