// Add constants here

// [HONDAIPB-Fixbug] - 17/09/2020 - Login not working (Impact by issue Data not sync when re-open dialog)
// Because api service not use constant -> config name not match (fixed)
export const databaseDefine = {
  // [HONDAIPB-CR] - 16/07/2020 - Change Setting default value
  configUrl: {
    name: 'url',
    value: 'https://hscwdp02.honda.co.th:44301/sap/opu/odata/sap/',
  },
  configSAPClient: {
    name: 'clientCode',
    value: '900',
  },
  configSAPLanguage: {
    name: 'clientLanguage',
    value: '',
  },
};

// Constant of dialog component
export const dialogConstant = {
  type: {
    ERROR: 'error',
    WARNING: 'warning',
    CONFIRM: 'confirm',
    INFO: 'info',
  },
  button: {
    FUNCTION: 'function',
    NONE_FUNCTION: 'none_function',
  },
};
// Constant of button component
export const buttonConstant = {
  BUTTON_SEARCH: 'BUTTON_SEARCH',
  // BUTTON_SAVE: 'BUTTON_SAVE',
  BUTTON_CANCEL: 'BUTTON_CANCEL',
  BUTTON_ADD: 'BUTTON_ADD',
  BUTTON_FILTER: 'BUTTON_FILTER',
  BUTTON_RESET: 'BUTTON_RESET',
  BUTTON_OK: 'BUTTON_OK',
  BUTTON_DEFAULT: 'BUTTON_DEFAULT',
};

// Constant of format
export const format = {
  FORMAT_DATE: 'DD/MM/YYYY',
};

// Constant of Type of List Checkbox
export const checkBoxTypeList = {
  STATUS: 'Status',
  TYPE: 'Type',
};

// Constant of field
export const FieldConstant = {
  type: {
    TEXT: 'text',
    TEXT_ONLY: 'text_only',
    NUMBER: 'number',
    PICKER: 'picker',
    SELECT: 'select',
    MULTI_SELECT: 'multiSelect',
    RANGE_INPUT: 'range_input',
    QUANTITY: 'qty_fields',
    TEXT_AREA: 'text_area',
    RECIPIENT: 'recipient',
    SCAN: 'quick_entry',
    PASSWORD: 'password',
    DATE_FROM_TO: 'data_from_to',
    CHECKBOX: 'checkbox',
    UPLOAD_IMAGE: 'upload_image',
    RECEIVED: 'received',
  },
  operator: {
    // Search number VO
    number: {
      EQ: {
        display: '=',
        value: 'eq',
      },
      LT: {
        display: '<',
        value: 'lt',
      },
      GT: {
        display: '>',
        value: 'gt',
      },
    },
    // Search text VO
    text: {
      EQ: {
        display: '=',
        value: 'eq',
      },
      LIKE: {
        display: 'like',
        value: 'like',
      },
    },
  },
  scan: {
    INIT: 'INIT',
    QUICK_SCAN: 'QUICK_SCAN',
    ENTRY_SCAN: 'ENTRY_SCAN',
    RECIPIENT: 'RECIPIENT',
  },
};

export const PaginationConfiguration = {
  itemsPerPage: 10,
  currentPage: 1,
  countFlag: 1,
};

export const NumberOfDocumentsFromSAP = {
  defaultDocuments: 100,
  maxDocumentsValue: 1000,
  maxLength: 4,
};

export const asyncStorageConst = {
  TOKEN: 'TOKEN',
  isHoneyWell: 'IS_HONEYWELL',
  UNAME: 'UNAME',
  LATESTUNAME: 'LATESTUNAME',
};

export const screen = {
  home: 'Home',
};

export const ResponsiveTable = {
  widthCol: 110,
  widthSapDoc: 70,
  paddingTable: 32,
  paddingCell: 2,
  partNo: 20,
  widthSapPart: 160,
  widthSapBpName: 480,
};

export const SAPLanguage = {
  thailan: 'TH',
  english: 'EN',
};

export const deviceInfo = {
  name: {
    GALAXY_A20: 'Galaxy A20',
  },
  manufacturer: {
    HONEYWELL: 'Honeywell',
  },
};

export const fieldRecipient = {
  maxLength: 10,
};

export const MenuConfiguration = {
  networkCheckingForGroupOfItemsCount: 3,
};

export const NotificationType = {
  IS_NAVIGATING_BACK: '1',
  IS_BACKGROUNDING: '2',
  // [#HONDAIPB-FixBug] - 24/06/2020 - Filter can not refresh after navigate others screen
  IS_CLEAR_FILTER: '3',
  // [#HONDAIPB-CR] - 16/07/2020 - Cancel previous request if HardwareBack press
  // Add new notify case
  IS_PROMISE_IN_PROGRESS: '4',
  IS_NOT_PROMISE_IN_PROGRESS: '5',
};

export const DeviceConfiguration = {
  memoryLimitPercentage: 0.9,
  inactivityTimeOut: 10 * 60 * 1000,
};

export const STATUS = {
  success: '200',
  badRequest: '400',
  unauthorizedAccess: '401',
  accessDenied: '403',
  notFound: '404 ',
  serverError: '500 ',
};

export const ScreenSizeDevice = {
  EDA61K: 350,
};

export const aMinute = 60000;
export const inactivityTimeOut = 10;

export const maxValueQuantity = '99999';
export const timingToastMsg = 2000;

export const INIT_CREATE = {
  id: '',
  Hh_Doc: '',
  Trx_Type: '',
  Sap_Doc: '',
  Sap_DocYear: '',
  Sap_DocType: '',
  Sap_Ref1: '',
  Sap_Ref1Year: '',
  Sap_Ref1Type: '',
  Sap_Ref2: '',
  Sap_Ref2Year: '',
  Sap_Ref2Type: '',
  Sap_Ref3: '',
  Sap_Ref3Year: '',
  Sap_Ref3Type: '',
  Sap_Bp: '',
  Sap_BpName: '',
  Sap_CompCode: '',
  Sap_Plant: '',
  Sap_Currency: '',
  Sap_Netprice: '',
  Sap_TaxAmount: '',
  Sap_AmountIncVat: '',
  Hh_Ref1: '',
  Hh_Recipient: '',
  Hh_CreateBy: '',
  Hh_ChangeBy: '',
  Hh_Subtitle: '',
  ETag: '',
  Hh_UnfinishedDoc: false,
  NvStkHdToItm: [],
};

export const statusConst = {
  status: {
    draft: 'Draft',
    cancelled: 'Cancelled',
    completed: 'Completed',
    deleted: 'Deleted',
    failed: 'Failed',
    submitted: 'Submitted',
    inTransit: 'In Transit',
    confirmed: 'Confirmed',
    partially: 'Partially Confirmed',
    partiallyReceived: 'Partially Received',
    unconfirmed: 'Unconfirmed',
  },
  statusCode: {
    draft: 1,
    confirmed: 2,
    partially: 3,
  }
};

export const stepConst = {
  fstStep: 'fstStep',
  sndStep: 'sndStep',
  trdStep: 'trdStep',
};

export const GRConstant = {
  type: 'type',
  branch: 'branch',
  vendor: 'vendor',
  createdBy: 'createdBy',
  status: 'sapExportedStatus',
  truckTemperature: 'truckTemperature',
  sku1: 'sku1',
  sku2: 'sku2',
  productTemperature1: 'productTemperature1',
  productTemperature2: 'productTemperature2',
  searchFieldName: {
    branch: 'branchCode',
    refNumber: 'refNumber',
    refNo: 'sapReceiptNumber',
    type: 'goodReceiptType',
    createdBy: 'createdBy',
    submittedDate: 'submittedTime',
    status: 'sapExportedStatus',
    deliveryNote: 'deliveryNote',
    vendor: 'vendor',
    materialDescription: 'materialDescription',
    batchNo: 'batchNo',
    materialDocument: 'materialDocument',
    poStoNumber: 'poStoNumber',
  },
  searchPopup: {
    defaultStatusValue: '2',
    defaultStatusDisplay: 'Completed',
  },
  branchPO: 'BRANCH PO',
  goodsReceipTypeValue: {
    branchPoTypeCode: '1',
  },
  deliveryType: {
    fullReceive: '3',
    underDelivery: '2',
  },
  statusValue: {
    complete: 'Completed',
    failed: 'Failed',
  },
  validate: {
    truckTemperature: 'Truck Temperature',
    refNo: 'PO/DO No.',
    productTemperature1: 'Product Temperature 1',
    productTemperature2: 'Product Temperature 2',
    deliveryNote: 'Invoice No./Delivery Note',
  },
};

export const ATConstant = {
  type: 'type',
  typeName: 'assetTransferType',
  branch: 'branch',
  vendor: 'vendor',
  createdBy: 'createdBy',
  status: 'sapExportedStatus',
  branchCodeFrom: 'branchCodeFrom',
  branchCodeTo: 'branchCodeTo',
  lendingDateFrom: 'lendingDateFrom',
  lendingDateTo: 'lendingDateTo',
  label: {
    assetRequestNo: 'Asset Request No',
    from: 'From',
    to: 'To',
    type: 'Type',
  },
  searchFieldName: {
    branch: 'branchCode',
    assetTransferNo: 'assetTransferNo',
    assetRequestNo: 'assetRequestNo',
    assetTransferType: 'assetTransferType',
    createdDate: 'createdDate',
    submittedDate: 'submittedDate',
    assetTransferStatus: 'assetTransferStatus',
    sSDNo: 'sSDNo',
    destination: 'destination',
    location: 'location',
    branchFrom: 'requestFromBranch',
    branchTo: 'requestToBranch',
  },
  customSearchFieldName: {
    requestFromBranch: 'requestFromBranch',
    requestToBranch: 'requestToBranch',
    assetTransferNo: 'assetTransferNo',

  },
  searchPopup: {
    defaultStatusValue: '2',
    defaultStatusDisplay: 'Completed',
  },
  branchPO: 'BRANCH PO',
  goodsReceipTypeValue: {
    branchPoTypeCode: 'Z31',
  },
  statusName: {
    submitted: 'Submitted'
  },
  statusValue: {
    complete: 'Completed',
    failed: 'Failed',
    draft: '1',
    submitted: '2'
  },
  // List type before update. just keep here to open when using server that not have the new data yet
  // typeValue: {
  //   fromAR: '5', // 'AR',
  //   location: '4', //'CL',
  //   assetLending: '6', //'AL',
  //   listTypeDisableToField: [
  //     '1', //'RP', // 'returnPermanent'
  //     '2', //'RS', // 'returnStripDown'
  //     '3', //'R', // 'repair'
  //     '4', //'Change Location
  //     '6', // asset lending
  //     '7', //'ALR', // 'assetLendingReturn'
  //     '8', // Branch Opening
  //     '5', //'AR', // 'fromAR'
  //   ],
  // },
  assetCategory: {
    Utensil: 'Utensil',
  },
  // List type after update
  typeValue: {
    fromAR: 'AR',
    location: 'CL',
    assetLending: 'AL',
    // returnPermanent: '1',
    returnPermanent: 'RP',
    returnStripDown: 'RS',
    // returnStripDown: '2',
    repair: 'R',
    // repair: '3',
    assetLendingReturn: 'ALR',
    // assetLendingReturn: '7',
    branchOpening: 'BO',
    // branchOpening: '8',
    listTypeDisableToField: [
      'RP', // 'returnPermanent'
      'RS', // 'returnStripDown'
      'R', // 'repair'
      'ALR', // 'assetLendingReturn'
      'AR', // 'fromAR'
    ],
  },
};
export const ATTrackingConstant = {
  status: {
    draft: 'draft',
  },
  statusCode: {
    draft: 1,
    confirm: 2,
    partially: 3,
  }
}
export const dateFormat = {
  mmddyyyy: 'MM/DD/yyyy',
  ddmmyyyy: 'DD/MM/yyyy',
  yyyymmdd: 'YYYY-MM-DD',
  yyyymmddHHmmss: 'YYYY-MM-DD HH:mm:ss',
  yyyymmddStartDay: 'YYYY-MM-DD 00:00:00',
  yyyymmddEndDay: 'YYYY-MM-DD 23:59:59',
  // format datetime from server for datetime data
  savingDateTime: 'YYYYMMDDHHmmss',
  savingDateTimeStartDate: 'YYYYMMDD000000',
  savingDateTimeEndDate: 'YYYYMMDD235959',
  searchingDateTime: 'YYYYMMDD000000',
  mainDate: 'DD.MM.YYYY',
  mainDateTime: 'DD.MM.YYYY HH:mm:ss',
  serverFormatRegex: /^[0-9]{14}$/g,
  dateTime: 'dddd, MMMM D, YYYY h:mm A',
  time: 'HH:mm:ss',
};

export const NumberConstant = {
  currency: 'Baht',
  decimalCharacter: '.',
  digitGroupSeparator: ',',
  numberDecimalCharacter: 2,
  normalDecimalCharacter: 2,
  maximumValue: 999999999.99,
  minimumValue: 0,
  statusConfirm: 1, //1 Confirmed, 0: UnConfirmed
};

export const detailFormConstant = {
  viewType: {
    listItems: 'list-items',
    customView: 'custom-view',
  },
};

export const Action = {
  save: 'save',
  submitted: 'submitted',
  new: 'new',
  update: 'update',
  confirm: 'confirm'
};

export const MessageConstant = {
  msgRequired: 'msgRequired',
  confirmBackToScreenList: 'confirmBackToScreenList'
};
