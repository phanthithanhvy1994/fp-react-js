export const MESSAGE = {
  ERROR_SYSTEM: 'Error system',
  M001: '<Field> is required.',
  M002: 'No results found.',
  M003: 'Data has been saved into local successfully.',
  M004: 'Are you sure you want to delete this information?',
  M005: 'This code is not existing in this list.',
  M006: 'Do you want to logout?',
  M007: 'Do you want to save data offline?',
  M008: '<Field Name> is only allows a maximum of <Field Size> characters',
  M009: 'Please input positive quantity in',
  M010: 'Something went wrong. Check your connection and try again.',
  M011: 'Timeout!',
  M012: 'There is no connection, do you want to search data offline?',
  M013: 'Not enough storage space!',
  M014: 'You can only enter positive integers with maximum value is <value>.',
  M015: 'Unable to connect to SAP',
  M016: "This part is currently selected 'zero count'",
  M017: "There's internal app error",
  M018: 'Please scan at least 1 spare part.',
  // [HONDAIPB-CR] - 16/07/2020 - In translate M019 & M020 is same.
  // But its used to 2 case => Define 2 constants.
  M019: 'Cancel get request',
  M020: 'Cancel post request',
  U001: 'Username locked',
  U002: 'Username invalid',
  U003: 'Username is not authorized',
  UPLOAD_FILE: {
    FILE_SIZE: 'Maximum upload size: 4MB',
    FILE_TYPE:
      'Only files with the following extensions are allowed: png, jpg, jpeg.',
  },
  GR: {
    DELETED_GR_SUCCESSFULLY: 'The GR No. %grNo% has been deleted.',
    CANCELLED_GR_SUCCESSFULLY: 'The GR No. %grNo% has been cancelled.',
    DELETE_CONFIRM_INSTANCE: 'Are you sure want to delete this %INSTANCE%?',
    CANCEL_CONFIRM_INSTANCE: 'Are you sure want to cancel this %INSTANCE%?',
    CANCEL_CONFIRM_DETAILS:
      'Are you sure want to cancel the Goods Receipt: %INSTANCE%?',
    SUBMIT_CONFIRM_DETAILS: 'Are you sure want to submit this Goods Receipt: %INSTANCE%?',
    SUBMIT_GR_DETAILS_SUCCESSFULLY: 'The GR has been submitted.',
    M030203_003: 'Invalid Ref. No!',
    M030203_005:
      'Do you want to continue loading the data of <{{refNo}}? Current data in the Goods Receipt will be erased.',
    ADJ_QUANTITY_REQUIRE_FLD: 'Adj Quantity is required. \n <{{listGRNo}}>',
    TEMPERATURE_REQUIRE_FLD: 'Temperature is required. \n <{{listGRNo}}>',
    PRODUCT_TEMPERATURE_REQUIRE_FLD: 'Product Temperature is required. \n <{{listGRNo}}>',
  },
  REDIRECT_WITHOUT_SAVING:
    'Are you sure you want to exit without saving? Any unsaved data will be lost.',
  AST: {
    FROM_TO_AR_MUST_BE_SAME: 'Please input Asset Request No. that has "From" and "To" the same as previous Asset Requests.',
    DUPLICATE_AR_NO: '<Asset_Code> already exists.',
    CONFIRM_CHANGE_TYPE: 'Are you sure you want to change "Type" info? Current data will be erased.',
    CONFIRM_CHANGE_FROM: 'Are you sure you want to change "From" info? Current added assets will be erased.',
    CONFIRM_CHANGE_TO: 'Are you sure you want to change "To" info? Location data will be refresh to initial display.',
    CONFIRM_DELETE_AR: 'Are you sure you want to delete this Asset Requet No.? Current added assets of this Asset Request will be erased.',
    CONFIRM_DELETE_AS_TRANSFER: 'Are you sure you want to delete the Asset Transfer: <{{astNo}}>?',
    DELETE_ASSET_TRANSFER_SUCCESSFULLY: 'The AST No. <{{astNo}}> has been deleted.',
    CONFIRM_CANCEL_AS_TRANSFER: 'Are you sure you want to cancel the Asset Transfer: <{{astNo}}>?',
    CANCEL_ASSET_TRANSFER_SUCCESSFULLY: 'The AST No. <{{astNo}}> has been cancelled.',
    DUPLICATE_ASSET_MASTER: '%ASSET_CODE% already exists.',
    ASSET_CATEGORY_NOT_MATCH: 'ASSET_CATEGORY_NOT_MATCH',
    PLANT_NOT_MATCH: 'PLANT_NOT_MATCH',
    TO_NOT_MATCH: 'TO_NOT_MATCH',
    ASSET_LENDING_RETURN_PLANT_NOT_MATCH: 'ASSET_LENDING_RETURN_PLANT_NOT_MATCH'
  },
  ASSET_TRANSFER_TRACKING: {
    DELETE_CONFIRM_INSTANCE: 'Are you sure you want to delete the ASK No.: %INSTANCE%?',
    DELETED_ASSET_SUCCESSFULLY: 'The ASK No. %INSTANCE% has been deleted.',
    DUPLICATE_AT_NO: '<Asset_Code> already exists.',
    CONFIRM_DELETE: 'Are you sure you want to delete this Asset Transfer No.? \n Current information this Asset Transfer will be erased.',
    EXIST_ASSET: '<Asset_Code> not found!'
  },
  ASSET_RECEIVING: {
    DELETED_AR_SUCCESSFULLY: 'The ARE No. %grNo% has been deleted.',
    DELETE_CONFIRM_INSTANCE: 'Are you sure want to delete this %INSTANCE%?',
  }
};
