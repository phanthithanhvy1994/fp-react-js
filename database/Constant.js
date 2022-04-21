export const tableConstant = {
  name: {
    CONFIG: 'TBL_CONFIG',
    MASTER: 'TBL_MASTER',
    DOC_HEADER: 'TBL_DOC_HEADER',
    DOC_ITEM: 'TBL_DOC_ITEM',
  },
  trx_type: {
    RECEIVE_PURCHASE: 'I_PURCHASE',
    SALES_RETURN: 'I_SALESRTN',
    TRANSFER_IN: 'I_TRANSFER',
    PARTS_RETURN: 'O_CLAIM',
    SALES_OUT: 'O_SALES',
    TRANSFER_OUT: 'O_TRANSFER',
    RANDOM_COUNT: 'C_RANDOM',
    STOCK_COUNT: 'C_NORMAL',
    STOCK_RECOUNT: 'C_RECOUNT',
  },
  subtitle: {
    PATH_RETURN_CREATE: 'O_CLAIM#Create',
  },
  masterKey: {
    I_PURCHASE: 1,
    I_SALESRTN: 2,
    I_TRANSFER: 3,
    O_CLAIM: 4,
    O_SALES: 5,
    O_TRANSFER: 6,
    C_RANDOM: 7,
    C_NORMAL: 8,
    C_RECOUNT: 9,
  },
  filterData: {
    RECEIVE_PURCHASE: {
      Hh_Doc: '',
      Sap_DocDate: {
        from: 0,
        to: 0,
      },
      Sap_Doc: '',
      Sap_DocYear: '',
      Sap_Ref1: '',
      Sap_Ref2: '',
      Sap_Bp: '',
      Sap_BpName: '',
    },
    RANDOM_STOCK_COUNT: {
      Hh_Doc: '',
      Sap_DocDate: {
        from: 0,
        to: 0,
      },
      Sap_Doc: '',
      Sap_DocYear: '',
    },
  },
  Hh_Default: 'T999999999999',
};
