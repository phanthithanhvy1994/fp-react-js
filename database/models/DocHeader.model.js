// import {tableConstant} from '../Constant';

// const Realm = require('realm');

// class DocHeader extends Realm.Object {}

// DocHeader.schema = {
//   name: tableConstant.name.DOC_HEADER,
//   primaryKey: 'id',
//   properties: {
//     id: 'string',
//     Hh_Doc: 'string',
//     Trx_Type: 'string',
//     Sap_Doc: 'string',
//     Sap_DocYear: 'string',
//     Sap_DocType: {type: 'string', default: ''},
//     Sap_Ref1: {type: 'string', default: ''},
//     Sap_Ref1Year: {type: 'string', default: ''},
//     Sap_Ref1Type: {type: 'string', default: ''},
//     Sap_Ref2: {type: 'string', default: ''},
//     Sap_Ref2Year: {type: 'string', default: ''},
//     Sap_Ref2Type: {type: 'string', default: ''},
//     Sap_Ref3: {type: 'string', default: ''},
//     Sap_Ref3Year: {type: 'string', default: ''},
//     Sap_Ref3Type: {type: 'string', default: ''},
//     Sap_DocDate: {type: 'int', optional: true},
//     Sap_PostingDate: {type: 'int', optional: true},
//     Sap_Bp: {type: 'string', default: ''},
//     Sap_BpName: {type: 'string', default: ''},
//     Sap_CompCode: {type: 'string', default: ''},
//     Sap_Plant: {type: 'string', default: ''},
//     Sap_Currency: {type: 'string', default: ''},
//     Sap_Netprice: {type: 'string', default: ''},
//     Sap_TaxAmount: {type: 'string', default: ''},
//     Sap_AmountIncVat: {type: 'string', default: ''},
//     Hh_Ref1: {type: 'string', optional: true},
//     Hh_Recipient: {type: 'string', default: ''},
//     Hh_CreateDate: {type: 'int', optional: true},
//     Hh_CreateTime: {type: 'string', optional: true},
//     Hh_CreateBy: {type: 'string', default: ''},
//     Hh_ChangeDate: {type: 'int', optional: true},
//     Hh_ChangeTime: {type: 'string', optional: true},
//     Hh_ChangeBy: {type: 'string', default: ''},
//     Hh_UnfinishedDoc: {type: 'bool', default: false},
//     Hh_Subtitle: {type: 'string', default: ''},
//     ETag: {type: 'string', default: ''},
//     // Relationship
//     NvStkHdToItm: {type: 'list', objectType: tableConstant.name.DOC_ITEM},
//   },
// };

// export default DocHeader;
