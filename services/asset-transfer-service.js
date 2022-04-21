import { Action } from '../constants/constants';
import apiService from './apiService';
import { API_PATHS } from './service.config';

class assetTransferService {
  deleteAssetTransfer(id) {
    return apiService.makeRequest(
      'get',
      API_PATHS.deleteAssetTransfer.replace('@assetTransferId', id),
    );
  };

  cancelAssetTransfer(id) {
    return apiService.makeRequest(
      'get',
      API_PATHS.cancelAssetTransfer.replace('@assetTransferId', id),
    );
  };

  loadAssetTransferStatus(param) {
    return apiService.makeRequest('get', API_PATHS.loadAssetTransferStatus, param);

    // return Promise.resolve({
    //   "status": "200",
    //   "data": [
    //     {
    //       "note": "",
    //       "typeClass": "GOOD_RECEIPT_STATUS",
    //       "requiredFlag": 0,
    //       "sortOrder": 0,
    //       "updateDate": "20210116165300",
    //       "deleteFlag": 0,
    //       "typeId": 99,
    //       "typeCode": "1",
    //       "typeName": "Draft",
    //       "typeEnName": "Draft"
    //     },
    //     {
    //       "note": "",
    //       "typeClass": "GOOD_RECEIPT_STATUS",
    //       "requiredFlag": 0,
    //       "sortOrder": 0,
    //       "updateDate": "20210116165300",
    //       "deleteFlag": 0,
    //       "typeId": 100,
    //       "typeCode": "2",
    //       "typeName": "Completed",
    //       "typeEnName": "Completed"
    //     },
    //     {
    //       "note": "",
    //       "typeClass": "GOOD_RECEIPT_STATUS",
    //       "requiredFlag": 0,
    //       "sortOrder": 0,
    //       "updateDate": "20210116165300",
    //       "deleteFlag": 0,
    //       "typeId": 101,
    //       "typeCode": "3",
    //       "typeName": "Cancelled",
    //       "typeEnName": "Cancelled"
    //     }
    //   ]
    // });
  };

  loadAssetTransferDestination(param) {
    // return apiService.makeRequest('get', API_PATHS.loadAssetTransferDestination, param);

    return Promise.resolve({
      "status": "200",
      "data": [
        {
          "note": "",
          "typeClass": "GOOD_RECEIPT_STATUS",
          "requiredFlag": 0,
          "sortOrder": 0,
          "updateDate": "20210116165300",
          "deleteFlag": 0,
          "typeId": 99,
          "typeCode": "1",
          "typeName": "Draft",
          "typeEnName": "Draft"
        },
        {
          "note": "",
          "typeClass": "GOOD_RECEIPT_STATUS",
          "requiredFlag": 0,
          "sortOrder": 0,
          "updateDate": "20210116165300",
          "deleteFlag": 0,
          "typeId": 100,
          "typeCode": "2",
          "typeName": "Completed",
          "typeEnName": "Completed"
        },
        {
          "note": "",
          "typeClass": "GOOD_RECEIPT_STATUS",
          "requiredFlag": 0,
          "sortOrder": 0,
          "updateDate": "20210116165300",
          "deleteFlag": 0,
          "typeId": 101,
          "typeCode": "3",
          "typeName": "Cancelled",
          "typeEnName": "Cancelled"
        }
      ]
    });
  };

  loadAssetTransferLocation(param) {
    // return apiService.makeRequest('get', API_PATHS.loadAssetTransferLocation, param);
    return Promise.resolve({ "status": "200", "data": [] })
    // return Promise.resolve({
    //     "status": "200",
    //     "data": [
    //         {
    //             "note": "",
    //             "typeClass": "GOOD_RECEIPT_STATUS",
    //             "requiredFlag": 0,
    //             "sortOrder": 0,
    //             "updateDate": "20210116165300",
    //             "deleteFlag": 0,
    //             "typeId": 99,
    //             "typeCode": "1",
    //             "typeName": "Draft",
    //             "typeEnName": "Draft"
    //         },
    //         {
    //             "note": "",
    //             "typeClass": "GOOD_RECEIPT_STATUS",
    //             "requiredFlag": 0,
    //             "sortOrder": 0,
    //             "updateDate": "20210116165300",
    //             "deleteFlag": 0,
    //             "typeId": 100,
    //             "typeCode": "2",
    //             "typeName": "Completed",
    //             "typeEnName": "Completed"
    //         },
    //         {
    //             "note": "",
    //             "typeClass": "GOOD_RECEIPT_STATUS",
    //             "requiredFlag": 0,
    //             "sortOrder": 0,
    //             "updateDate": "20210116165300",
    //             "deleteFlag": 0,
    //             "typeId": 101,
    //             "typeCode": "3",
    //             "typeName": "Cancelled",
    //             "typeEnName": "Cancelled"
    //         }
    //     ]
    // });
  };

  // Service Detail Page
  getAssetTransferDetailsById(id) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getAssetTransferByID.replace('@assetTransferId', id)
    );

    // return Promise.resolve({
    //   "status": "200",
    //   "data": {
    //     "assetTransferId": 30,
    //     "assetTransferNumber": "GR00000042",
    //     "inventoryCode": "B001",
    //     "poNumber": "3100000027",
    //     "refNumber": "3100000027",
    //     "notes": "Branch PO test",
    //     "updateDate": "20210203122259",
    //     "deleteFlag": 0,
    //     "totalQty": 0.0000,
    //     "totalDoQty": 0.0000,
    //     "sapExportedStatus": 2,
    //     "submittedTime": "20210131000000",
    //     "createdDate": "20210131000000",
    //     "version": 1,
    //     "goodReceiptType": "Z31",
    //     "goodReceiptTypeName": "BRANCH PO",
    //     "branchCode": "B001",
    //     "branchName": "เซ็นทรัล ลาดพร้าว",
    //     "truckTemperature": 36,
    //     "vendorCode": "0010000043",
    //     "vendorName": "เดอะแคทเทอริ่ง บจก.",
    //     "deliveryNote": "Test GR for branch PO",
    //     "materialDocument": "5000000264",
    //     "listARNo": [
    //       {
    //         "assetRequestNo": "666666",
    //         "categoryInfo": {
    //           "assetCode": 123,
    //           "category": 'Kitchen ware',
    //           "subCategory": 'Microware',
    //           "description": '1000W',
    //           "quantity": 8,
    //           "itemInfo": [{
    //             "description": "test1",
    //             "code": "123",
    //             "quantity": 1,
    //             "unit": "EA",
    //           }, {
    //             "description": "test2",
    //             "code": "123",
    //             "quantity": 1,
    //             "unit": "EA",
    //           }]
    //         }
    //       },
    //       {
    //         "assetRequestNo": "888888",
    //         "categoryInfo": {
    //           "assetCode": 123,
    //           "category": 'Non IT',
    //           "subCategory": 'Kitchen ware',
    //           "description": 'Microware',
    //           "quantity": 10,
    //         }
    //       }
    //     ],
    //     "listARData": [
    //       {
    //         "assetRequestNo": 123,
    //         "assetCode": 123,
    //         "category": 'Kitchen ware',
    //         "subCategory": 'Microware',
    //         "description": '1000W',
    //         "quantity": 8,
    //       },
    //       {
    //         "assetRequestNo": 123,
    //         "assetCode": 123,
    //         "category": 'Kitchen ware',
    //         "subCategory": 'Microware',
    //         "description": '1000W',
    //         "quantity": 8,
    //       }
    //     ],
    //   }
    // });
  };

  getAssetTransferList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getAssetTransferList,
      {},
      {},
      param,
    );
  }

  getType() {
    return apiService.makeRequest('get', API_PATHS.getASTType);
    // return Promise.resolve({
    //   data: [
    //     { id: 1, value: 'fromAR', display: 'From Asset Request' },
    //     { id: 2, value: 'location', display: 'Change Location' },
    //     { id: 3, value: 'returnPermanent', display: 'Return Permanent' },
    //     { id: 4, value: 'returnStripDown', display: 'Return-Strip Down' },
    //     { id: 5, value: 'repair', display: 'Repair' },
    //     { id: 6, value: 'assetLendingReturn', display: 'Asset Lending Return' },
    //     { id: 7, value: 'assetLending', display: 'Asset Lending' },
    //     { id: 8, value: 'branchOpening', display: 'Branch Opening' },
    //   ]
    // });
  }

  getDestination(param) {
    // return apiService.makeRequest('get', API_PATHS.getASTDestination, param);
    return Promise.resolve({
      data: [
        { id: 1, value: '1', display: 'destination 1' },
        { id: 2, value: '2', display: 'destination 2' },
        { id: 3, value: '3', display: 'destination 3' },
      ]
    });
  }

  loadARData(params) {
    return apiService.makeRequest('post', API_PATHS.scanARData, {}, {}, params);
    // return Promise.resolve({
    //   status: 200,
    //   data: [{
    //     assetRequestDetailId: '123',
    //     assetRequestMasterName: 'demo-demo',
    //     branchCodeFrom: params.assetRequestNo === '12345' ? 'B111' : 'B001',
    //     branchCodeTo: params.assetRequestNo === '12345' ? 'B112' : 'B001',
    //     assetRequestNo: params.assetRequestNo,
    //     ssdNo: params.assetRequestNo === '1234' ? '1234' : '123',
    //     assetCategory: 'Utensil'
    //   }, {
    //     assetRequestDetailId: '1234',
    //     assetRequestMasterName: 'demo-demo2',
    //     branchCodeFrom: params.assetRequestNo === '12345' ? 'B111' : 'B001',
    //     branchCodeTo: params.assetRequestNo === '12345' ? 'B112' : 'B001',
    //     assetRequestNo: params.assetRequestNo,
    //     ssdNo: params.assetRequestNo === '1234' ? '1234' : '123',
    //     assetCategory: 'Utensil'
    //   }]
    // });
  }

  loadATData(params) {
    return apiService.makeRequest('get', API_PATHS.getATData, params);
    // case type !== asset request
    // return Promise.resolve({
    //   status: 200,
    //   data: {
    //     assetTransferType: '6',
    //     branchCodeFrom: 'B001',
    //     branchCodeTo: 'B001',
    //     notes: 'demo',
    //     lendingDateFrom: '20211111000000',
    //     lendingDateTo: '20211112000000',
    //     ssdNo: 'sample',
    //     assetTransferDetailTbls: [{
    //       assetTransferRequestDetailVOS: [{
    //         assetMasterId: 3,
    //         quantity: 8,
    //         baseUom: 'EA',
    //         assetLocationCode: 'HB0102',
    //         plant: 1000
    //       }, {
    //         assetMasterId:2,
    //         quantity: 8,
    //         baseUom: 'EA',
    //         assetLocationCode: 'HB0101',
    //         plant: 1000
    //       }]
    //     }]
    //   }
    // });
    // return Promise.resolve({
    //   status: 200,
    //   data: {
    //     assetTransferType: 'AR',
    //     branchCodeFrom: 'B001',
    //     branchCodeTo: 'B001',
    //     notes: 'demo',
    //     lendingDateFrom: '20211111000000',
    //     lendingDateTo: '20211112000000',
    //     ssdNo: 'sample',
    //     assetTransferDetailTbls: [{
    //       assetRequestNo: 'sample AR 1',
    //       assetRequestMaster: [{
    //         assetRequestDetailId: '456',
    //         assetRequestMasterName: 'demo-demo',
    //       }, {
    //         assetRequestDetailId: '789',
    //         assetRequestMasterName: 'demo-demo1',
    //       }],
    //       assetTransferRequestDetailVOS: [{
    //         assetRequestDetailId: '456',
    //         assetMasterId: 3,
    //         quantity: 8,
    //         baseUom: 'EA',
    //         assetLocationCode: 'HB0102',
    //         plant: 1000
    //       }, {
    //         assetRequestDetailId: '456',
    //         assetMasterId:2,
    //         quantity: 8,
    //         baseUom: 'EA',
    //         assetLocationCode: 'HB0101',
    //         plant: 1000
    //       }]
    //     },{
    //       assetRequestNo: 'sample AR 2',
    //       assetRequestMaster: [{
    //         assetRequestDetailId: '89',
    //         assetRequestMasterName: 'demo-demo1',
    //       }],
    //       assetTransferRequestDetailVOS: [{
    //         assetRequestDetailId: '89',
    //         assetMasterId: 3,
    //         quantity: 8,
    //         baseUom: 'EA',
    //         assetLocationCode: 'HB0102',
    //         plant: 1000
    //       }]
    //     }]
    //   }
    // });
  }

  saveATData(params, savingType) {
    const path = savingType === Action.new ? API_PATHS.insertATData : API_PATHS.updateATData;
    return apiService.makeRequest('post', path, {}, {}, params);
    // return Promise.resolve({
    //   status: 200,
    //   data: {
    //     assetTransferNo: 'AT0001'
    //   }
    // });
  }

  loadATransData(params) {
    return Promise.resolve({
      data: {
        listARData: [
          {
            assetRequestNo: 123,
            assetCode: 123,
            category: 'Kitchen ware',
            subCategory: 'Microware',
            description: '1000W',
            quantity: 8,
          },
          {
            assetRequestNo: 123,
            assetCode: 123,
            category: 'Kitchen ware',
            subCategory: 'Microware',
            description: '1000W',
            quantity: 8,
          }
        ]
      }
    });
  }

  getDataScanning(params) {
    return apiService.makeRequest('post', API_PATHS.scanAssetMaster, {}, {}, params);
    // return Promise.resolve({
    //   data:
    //     { 
    //       assetMasterId: 1,
    // quantity: 0,
    // baseUom: "EA",
    // assetRequestMaster: [],
    // assetTransferRequestDetailVOS: [],
    // deleteFlag: 0
    //     },
    // });
    // return Promise.resolve({
    //   data:
    //     { 
    //       assetMasterId: 1,
    //       quantity: 10,
    //       baseUom: 'EA',
    //       assetNo: params.assetNo,
    //       assetCategory: 'Utensil',
    //       plant: 'B001',
    //       deleteFlag: 0
    //     },
    // });
  }

  loadAssetTransferDetail(param) {
    return apiService.makeRequest('get', API_PATHS.loadAssetTransferDetail, param);
  }
}

export default new assetTransferService();