
class assetReceiptService {
  getAssetReceiptList(param) {
    // return apiService.makeRequest(
    //     'post',
    //     API_PATHS.getAssetTranferList,
    //     {},
    //     {},
    //     param,
    // );

    return Promise.resolve({
      "status": "200",
      "data": [
        {
          "assetReceiptId": 2222,
          "arNo": '190600001',
          "atNo": '1',
          "from": 'abc',
          'createdBy': 'admin',
          'sapExportedStatusName': 'Draft',
          "sapExportedStatus": 1,
          'assetReceiptItemsList': [
            {
              'assetId': 1,
              'description': 'description1',
              'unit': 'unit1',
              'assetType': 1,
              'assetTypeName': 'asset Type Name1',
            },
            {
              'assetId': 2,
              'description': 'description2',
              'unit': 'unit2',
              'assetType': 2,
              'assetTypeName': 'asset Type Name2',
            },
            {
              'assetId': 3,
              'description': 'description3',
              'unit': 'unit3',
              'assetType': 3,
              'assetTypeName': 'asset Type Name3',
            },
          ]
        },
        {
            "assetReceiptId": 2333,
            "arNo": '190600001',
            "atNo": '2',
            "from": 'qwe',
            "sapExportedStatus": 3,
            "sapExportedStatusName": "Cancelled",
            'createdBy': 'zxczxczx',
            'assetReceiptItemsList': []
        },
        {
            "assetReceiptId": 3432,
            "arNo": '190600001',
            "atNo": '1',
            "from": 'abc',
            'sapExportedStatusName': 'Draft',
            "sapExportedStatus": 1,
            'createdBy': 'admin',
            'assetReceiptItemsList': []
        },
      ]
    })
  }

  getAssetReceiptDetailById(id) {
    return Promise.resolve({
      "status": "200",
      "data":
      {
        "assetReceiptId": 1,
        "arNo": '190600001',
        "atNo": '1',
        "from": 'abc',
        'createdBy': 'admin',
        'status': 'completed',
        'assetReceiptItemsList': [
          {
            'assetId': 1,
            'description': 'description1',
            'unit': 'unit1',
            'assetType': 1,
            'assetTypeName': 'asset Type Name1',
            'catalog': 'catalog1'
          },
          {
            'assetId': 2,
            'description': 'description2',
            'unit': 'unit2',
            'assetType': 2,
            'assetTypeName': 'asset Type Name2',
            'catalog': 'catalog2'
          },
          {
            'assetId': 3,
            'description': 'description3',
            'unit': 'unit3',
            'assetType': 3,
            'assetTypeName': 'asset Type Name3',
            'catalog': 'catalog3'
          },
        ]
      },
    })
  }
}

export default new assetReceiptService()