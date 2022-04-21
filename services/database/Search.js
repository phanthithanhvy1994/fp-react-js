// import Realm from 'realm';
// import {databaseOptions} from '../../database/Realm';
// import {tableConstant} from '../../database/Constant';
// import {createQuickSearchQry} from '../../utils/functions';

// const searchWithPK = (tableName, key) =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         let rows = realm.objectForPrimaryKey(tableName, key);
//         resolve(rows);
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });

// const searchWithTrxType = transactionType =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         let table = realm
//           .objects(tableConstant.name.DOC_HEADER)
//           .filtered(
//             'Trx_Type == $0 && Hh_UnfinishedDoc == true',
//             transactionType,
//           );
//         if (table) {
//           resolve(table.sorted('Hh_Doc'));
//         }
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });

// const countUnfinishedDoc = () =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         let table = realm
//           .objects(tableConstant.name.DOC_HEADER)
//           .filtered('Hh_UnfinishedDoc == true');
//         if (table) {
//           resolve(table.length);
//         }
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });

// const filterList = (transactionType, searchedObj) =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         const searchQry = createQuickSearchQry(
//           transactionType,
//           searchedObj.Sap_Doc,
//         );
//         let table = realm
//           .objects(tableConstant.name.DOC_HEADER)
//           .filtered(searchQry);
//         if (table) {
//           if (transactionType === tableConstant.trx_type.PARTS_RETURN) {
//             table = table.filtered('Hh_Doc != $0', tableConstant.Hh_Default);
//             resolve(table.sorted('Sap_Doc', true));
//           } else {
//             resolve(table.sorted([['Sap_DocYear', true], ['Sap_Doc', true]]));
//           }
//         }
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });

// export {searchWithPK, searchWithTrxType, countUnfinishedDoc, filterList};
