// import Realm from 'realm';
// import {databaseOptions} from '../../database/Realm';
// import {tableConstant} from '../../database/Constant';
// import {mapSaveItemsId} from '../../utils/functions';

// const insert = (tableName, createVal) =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         realm.write(() => {
//           realm.create(tableName, createVal);
//           if (tableName === tableConstant.name.MASTER) {
//             let headers = realm
//               .objects(tableConstant.name.DOC_HEADER)
//               .filtered(
//                 'Trx_Type == $0 && Hh_UnfinishedDoc == false',
//                 createVal.Trx_Type,
//               );
//             if (headers) {
//               switch (createVal.Trx_Type) {
//                 case tableConstant.trx_type.PARTS_RETURN:
//                   // [#HONDAIPB-CR] - O_CLAIM List, please change the sort to HH-Doc Descending.
//                   headers = headers.sorted('Hh_Doc', true);
//                   break;
//                 default:
//                   headers = headers.sorted([
//                     ['Sap_DocYear', true],
//                     ['Sap_Doc', true],
//                   ]);
//                   break;
//               }
//               resolve(headers);
//             }
//           } else {
//             resolve(createVal);
//           }
//         });
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });

// const update = (tableName, key, updateVal, header = {}) =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         realm.write(() => {
//           let table = {},
//             idTmp;
//           switch (tableName) {
//             case tableConstant.name.CONFIG:
//               table = realm.objectForPrimaryKey(tableName, key);
//               table.value = updateVal.value;
//               break;
//             // Save Offline
//             case tableConstant.name.DOC_HEADER:
//               table = realm.objects(tableName).filtered('Hh_Doc == $0', key);
//               // header.Hh_Subtitle === '', Block case Add part return.
//               if (Object.keys(table).length === 1) {
//                 if (header.Hh_Subtitle === '') {
//                   idTmp = `1#${header.Hh_Doc}`;
//                   mapSaveItemsId(updateVal, idTmp);
//                   header.id = idTmp;
//                   header.NvStkHdToItm = updateVal;
//                   header.Hh_UnfinishedDoc = true;
//                   realm.create(tableConstant.name.DOC_HEADER, header);
//                 } else {
//                   // Nesting to Parts Return Create Obj
//                   table = table.find(
//                     element => element.Hh_UnfinishedDoc === true,
//                   );
//                   // Case Add Parts Return
//                   mapSaveItemsId(updateVal, table.id);
//                   table.NvStkHdToItm = updateVal;
//                   table.Sap_Doc = header.Sap_Doc;
//                   table.Sap_DocYear = header.Sap_DocYear;
//                   table.Hh_Ref1 = header.Hh_Ref1;
//                   table.Hh_Recipient = header.Hh_Recipient;
//                   table.Hh_CreateDate = header.Hh_CreateDate;
//                 }
//               }
//               // Case Header was exists in DB -> Created UnfinishedDoc -> Update
//               if (Object.keys(table).length === 2) {
//                 table = table.find(
//                   element => element.Hh_UnfinishedDoc === true,
//                 );
//                 mapSaveItemsId(updateVal, table.id);
//                 table.NvStkHdToItm = updateVal;
//                 if (header.Hh_Recipient) {
//                   table.Hh_Recipient = header.Hh_Recipient;
//                 }
//               }
//               break;
//             default:
//               break;
//           }
//           resolve(table);
//         });
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });

// const deleteRow = (tableName, key) =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         realm.write(() => {
//           let row = realm.objectForPrimaryKey(tableName, key);
//           if (row) {
//             if (tableName === tableConstant.name.DOC_HEADER) {
//               if (row.NvStkHdToItm) {
//                 realm.delete(row.NvStkHdToItm);
//               }
//             }
//             realm.delete(row);
//           }
//           resolve();
//         });
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });

// const deleteAfterSaveSAP = (tableName, key) =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         realm.write(() => {
//           let rows = realm
//             .objects(tableName)
//             .filtered('Hh_Doc == $0 && Hh_UnfinishedDoc == true', key);
//           if (rows) {
//             if (tableName === tableConstant.name.DOC_HEADER) {
//               for (const i in rows) {
//                 if (rows[i].NvStkHdToItm) {
//                   realm.delete(rows[i].NvStkHdToItm);
//                 }
//               }
//             }
//             realm.delete(rows);
//           }
//           resolve();
//         });
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });

// const deleteTrx_Type = (tableName, key, transactionType) =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         realm.write(() => {
//           let row = realm.objectForPrimaryKey(tableName, key);
//           let header = realm
//             .objects(tableConstant.name.DOC_HEADER)
//             .filtered(
//               'Trx_Type == $0 && Hh_UnfinishedDoc == false',
//               transactionType,
//             );
//           if (row) {
//             if (header) {
//               for (const i in header) {
//                 if (header[i].NvStkHdToItm) {
//                   realm.delete(header[i].NvStkHdToItm);
//                 }
//               }
//               realm.delete(header);
//             }
//             realm.delete(row);
//           }
//           resolve();
//         });
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });

// export {insert, update, deleteRow, deleteTrx_Type, deleteAfterSaveSAP};
