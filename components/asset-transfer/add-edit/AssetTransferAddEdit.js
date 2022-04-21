import React from 'react';
import {SafeAreaView} from 'react-native';
import {withTranslation} from 'react-i18next';
import DetailForm from '../../shared/detail-form/DetailForm';
import {
  configStep,
  validationSchema,
  customButtonStep,
  validationSchemaForARType,
  validationSchemaForOtherType,
  validationSchemaForSpecialType,
  bottomActionNextBtnConfig
} from './asset-transfer-add-edit.config';
import {
  getASTType,
  getDestination,
  loadARData,
  loadATData,
  saveATData,
  loadATransData,
  getDataScanning,
} from '../../../actions/asset-transfer-action';
import { getAssetLocation, getBranchByUser } from '../../../actions/common-action';
import { updateConfigStep } from '../../../utils/detail-form-util';
import { showMessage, getErrorMessage } from '../../../utils/message-util';
import { MESSAGE } from '../../../constants/message';
import { ATConstant, Action, AssetTransfer, MessageConstant, dateFormat } from '../../../constants/constants';
import { closeCustomButtonHeader } from '../../../redux/button-header/ButtonHeader.action';
import { formatComboBox, formatDropdownList } from '../../../utils/format-util';
import { formatDateString, convertToServerFormat } from '../../../utils/date-util';

class AssetTransferAddEdit extends React.Component {
  isViewMounted = true;

  constructor(props) {
    super(props);
    this.state = {
      configStep,
      detailData: {},
      validationSchema: validationSchema(this.props.t),
      assetRequestMasterId: null,
      index: null,
      validationSchema: validationSchema(this.props.t)
    };
  }

  loadType = () => {
    return new Promise(resolve => {
      getASTType().then(res => {
        resolve(res);
      }).catch(() => {
        resolve({ data: [] });
      });
    });
  }

  loadBranchByUser = () => {
    return new Promise(resolve => {
      getBranchByUser().then(res => {
        resolve(res);
      }).catch(() => {
        resolve({ data: [] });
      });
    });
  }

  loadAssetLocation = (plant) => {
    return new Promise(resolve => {
      getAssetLocation({
        plant
      }).then(res => {
        if (getErrorMessage(res)) {
          showMessage(getErrorMessage(res));
          return;
        }
        resolve(res);
      }).catch(() => {
        resolve({ data: [] });
      });
    });
  }

  loadATData = (assetTransferNo) => {
    loadATData({
      id: assetTransferNo
    }).then(res => {
      if (getErrorMessage(res)) {
        showMessage(getErrorMessage(res));
        return;
      }
      const listARNo = res.data.assetTransferDetailTbls.map(el => el.assetRequestNo);
      const { t } = this.props;

      this.setState({
        detailData: {
          ...res.data,
          listARNo,
          validationSchema: res.data.assetTransferType === ATConstant.typeValue.fromAR ? validationSchemaForARType(t) :
          (ATConstant.typeValue.listTypeDisableToField.indexOf(res.data.assetTransferType) !== -1 ? validationSchemaForOtherType(t) : validationSchemaForSpecialType(t)),
      }});
    });
  }

  resetFormValue = (detailData, keepName, keepValue) => {
    return {
      ...detailData,
      branchCodeFrom: '',
      branchCodeTo: '',
      lendingPeriod: null,
      ssdNo: '',
      [keepName]: keepValue,
      listARNo: null,
      assetTransferDetailTbls: [],
      notes: '',
      assetRequestNo: '',
    };
  }

  /**
   * Show confirmation if has at least 1 field has value.
   * @param {String} value 
   * @param {String} name 
   */
  onTypeChange = (value, name) => {
    const switchType = (value, name) => {
      const { t } = this.props;
      this.setState({
        detailData: this.resetFormValue({...this.state.detailData}, name, value),
        validationSchema: value === ATConstant.typeValue.fromAR ? validationSchemaForARType(t) :
          (ATConstant.typeValue.listTypeDisableToField.indexOf(value) !== -1 ? validationSchemaForOtherType(t) : validationSchemaForSpecialType(t)),
      });
    };

    const detailData = this.state.detailData || {};
    const {
      listARNo,
      notes,
      branchCodeFrom,
      branchCodeTo,
      ssdNo,
      lendingPeriod,
      assetRequestNo
    } = detailData;
    // Only show confirm when at least 1 data has value
    // else only update type value
    if ((listARNo && listARNo.length > 0) || notes || branchCodeFrom ||
      branchCodeTo || ssdNo || lendingPeriod || assetRequestNo
    ) {
      showMessage(MESSAGE.AST.CONFIRM_CHANGE_TYPE, switchType.bind(this, value, name), true);
    } else {
      switchType(value, name);
    }
  }

  /**
   * Check if the asset transfer has at leats 1 scan asset master
   * @param {String} assetRequestNo 
   * @returns 
   */
  isScanAssetMaster = (assetRequestNo) => {
    const assetTransferDetailTbls = (this.state.detailData && this.state.detailData.assetTransferDetailTbls) || [];

    // In case check only for specific asset request no
    if (assetRequestNo) {
      const assetInfoIndex = assetTransferDetailTbls.findIndex(el => el.assetRequestNo === assetRequestNo);
      return assetTransferDetailTbls[assetInfoIndex].assetTransferRequestDetailVOS && assetTransferDetailTbls[assetInfoIndex].assetTransferRequestDetailVOS.length > 0;
    } else {
      for (let i = 0; i < assetTransferDetailTbls.length; i++) {
        if (assetTransferDetailTbls[i].assetTransferRequestDetailVOS &&
          assetTransferDetailTbls[i].assetTransferRequestDetailVOS.length > 0) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Show confirmation when changing from/to when having scanning asset.
   * For changing To. Clear all receiving location.
   * For changing from. Clear all scan data
   */
  onFromToChange = (value, name) => {
    const typeValue = this.state.detailData && this.state.detailData.assetTransferType;

    // Switch from/to value. Update associate data.
    const switchFrom = (value, name) => {
      const assetTransferDetailTbls = this.state.detailData.assetTransferDetailTbls || [];
      // Filter to clear associate data
      const clearAllScanData = typeValue === ATConstant.typeValue.fromAR ? assetTransferDetailTbls.map(el => {
        return { ...el, assetTransferRequestDetailVOS: [] };
      }) : [];
      const clearReceivingLocation = assetTransferDetailTbls.map(el => {
        return {
          ...el,
          assetTransferRequestDetailVOS: (el.assetTransferRequestDetailVOS && el.assetTransferRequestDetailVOS.map(scanItem => ({
            ...scanItem,
            assetLocationCode: ''
          }))) || []
        };
      });

      this.setState({
        detailData: {
          ...this.state.detailData,
          assetTransferDetailTbls: name === ATConstant.branchCodeFrom ? clearAllScanData : clearReceivingLocation,
          [name]: value
        }
      });
    }

    if (this.isScanAssetMaster() && (name === ATConstant.branchCodeFrom || (
      typeValue === ATConstant.typeValue.location || typeValue === ATConstant.typeValue.assetLending
    ))) {
      showMessage(
        name === ATConstant.branchCodeFrom ? MESSAGE.AST.CONFIRM_CHANGE_FROM : MESSAGE.AST.CONFIRM_CHANGE_TO,
        switchFrom.bind(this, value, name),
        true
      );
    } else {
      switchFrom(value, name);
    }
  }

  onFieldChange = (event) => {
    const { value, name } = event.target;
    if (!this.isViewMounted) {
      return;
    }
    switch (name) {
      case ATConstant.typeName:
        this.onTypeChange(value, name);
        break;
      case ATConstant.branchCodeFrom:
      case ATConstant.branchCodeTo:
          this.onFromToChange(value, name);
          break;
      default:
        this.setState({
          detailData: {
            ...this.state.detailData,
            [name]: value
          }
        });
        break;
    }
  }

  /**
   * Get AR data and add it into view if valid.
   * Do not allow add AR that has different branchCodeFrom and branchCodeTo
   */
  onARNoAddIconClick = () => {
    const arNoVal = this.state.detailData.assetRequestNo && this.state.detailData.assetRequestNo.trim();
    if (arNoVal) {
      // DOn't allow re-add if it has been already added into list
      if (this.state.detailData.listARNo && this.state.detailData.listARNo.indexOf(arNoVal) !== -1) {
        showMessage(MESSAGE.AST.DUPLICATE_AR_NO.replace('<Asset_Code>', arNoVal));
        return;
      }

      // Load asset request data
      loadARData({
        assetRequestNo: arNoVal
      }).then(res => {
        let assetTransferDetailTbls = this.state.detailData.assetTransferDetailTbls || [];
        const listARNo = this.state.detailData.listARNo || [];
        const { branchCodeFrom, branchCodeTo } = this.state.detailData;
        const errorMsg = getErrorMessage(res);
        if (errorMsg) {
          showMessage(errorMsg);
          return;
        }
        // DOnt allow added another Asset Request that has branch from/to differeent with others
        if (res && res.data && res.data[0] && branchCodeFrom && branchCodeTo
          && (branchCodeFrom !== res.data[0].branchCodeTo
            || branchCodeTo !== res.data[0].branchCodeFrom)
        ) {
          showMessage(MESSAGE.AST.FROM_TO_AR_MUST_BE_SAME);
          return;
        }

        const firstItem = res.data[0];
        listARNo.push(arNoVal);
        // 1 Asset Request contains n asset request detail data inside.
        // 1 Asset request detail contains n asset master(scan) inside
        assetTransferDetailTbls.push({
          assetRequestNo: arNoVal,
          ssdNo: res.data[0].ssdNo,
          assetRequestMaster: res.data.map(el => ({
            assetRequestDetailId: el.assetRequestDetailId,
            assetRequestMasterName: el.assetRequestMasterName,
            quantity: el.quantity,
            assetCategory: el.assetCategory
          })),
          assetTransferRequestDetailVOS: []
        });
        this.setState({
          detailData: {
            ...this.state.detailData,
            // From of AR is to of AT and reverse
            branchCodeFrom: (firstItem && firstItem.branchCodeTo) || '',
            branchCodeTo: (firstItem && firstItem.branchCodeFrom) || '',
            listARNo,
            assetTransferDetailTbls
          },
        });
      });
    }
  }

  onARNoChange = (event) => {
    onFieldChange(event);
  }

  /**
   * Remove asset request line
   */
  onRemoveAssetRequestNo = (value, index) => {
    const removeAR = (value, index) => {
      let listARNo = (this.state.detailData && this.state.detailData.listARNo) || [];
      const assetTransferDetailTbls = this.state.detailData.assetTransferDetailTbls.filter(
        el => el.assetRequestNo !== value
      );
      listARNo = listARNo.filter((tempVal, tempIndex) => index !== tempIndex);

      this.setState({
        detailData: {
          ...this.state.detailData,
          listARNo: (listARNo.length > 0 && listARNo) || null,
          branchCodeFrom: assetTransferDetailTbls.length === 0 ? '' : this.state.detailData.branchCodeFrom,
          branchCodeTo: assetTransferDetailTbls.length === 0 ? '' : this.state.detailData.branchCodeTo,
          assetTransferDetailTbls
        },
      });
    }

    if (this.isScanAssetMaster(value)) {
      showMessage(MESSAGE.AST.CONFIRM_DELETE_AR, removeAR.bind(this, value, index), true);
    } else {
      removeAR(value, index);
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { isEditPage, assetTransferNo } = (navigation.state && navigation.state.params) || {};
    this.assetTransferNo = assetTransferNo;
    if (!this.isViewMounted) {
      return;
    }
    Promise.all([
      this.loadType(),
      this.loadBranchByUser()
    ]).then(values => {
      if (!this.isViewMounted) {
        return;
      }
      this.setState({
        listComboboxData: {
          type: formatComboBox(values[0].data),
          branch: formatDropdownList(values[1].data, 'branchCode','branchName'),
        }
      });
      if (isEditPage) {
        this.loadATData(assetTransferNo);
      }
    });
  }

  componentWillUnmount() {
    this.isViewMounted = false;
    closeCustomButtonHeader();
  }

  handleSave = (savingType) => {
    return new Promise((resolve, reject) => {
      const { navigation, t } = this.props;
      const data = this.state.detailData || {};
      let lendingDateFrom = data.lendingDateFrom || new Date();
      let lendingDateTo = data.lendingDateTo || new Date();
      const detailData = {
        assetTransferId: data.assetTransferId,
        assetTransferType: data.assetTransferType,
        branchCodeFrom: data.branchCodeFrom,
        branchCodeTo: data.branchCodeTo,
        ssdNo: data.ssdNo,
        status: savingType === Action.save ? ATConstant.statusValue.draft : ATConstant.statusValue.submitted,
        notes: data.notes,
        assetTransferDetailTbls: data.assetTransferDetailTbls,
        lendingDateFrom: data.assetTransferType === ATConstant.typeValue.assetLending ? convertToServerFormat(lendingDateFrom) : '',
        lendingDateTo: data.assetTransferType === ATConstant.typeValue.assetLending ? convertToServerFormat(lendingDateTo) : '',
      };

      if (!this.isScanAssetMaster()) {
        showMessage(t(MessageConstant.msgRequired).replace('<Field>', t('scanInfo')));
        return reject();
      }

      saveATData(detailData, this.assetTransferNo ? Action.update : Action.new).then(res => {
        if (getErrorMessage(res)) {
          showMessage(getErrorMessage(res));
          reject();
          return;
        }
        showMessage(savingType === Action.save ?
          this.props.t('saveASTSuccessfully').replace('%AST_NO%', res.data.assetTransferNo) :
          this.props.t('submitASTSuccessfully').replace('%AST_NO%', res.data.assetTransferNo),
          () => {
            resolve();
            navigation.navigate('AssetTransferList');
          }
        );
      });
    });
  }

  handleForSaveButton = () => {
    return this.handleSave(Action.save);
  }

  handleForSubmitButton = () => {
    return this.handleSave(Action.submit);
  }

  // Begin Step 2

  onPressMasterId = (id, index) => {
    this.setState({assetRequestMasterId: id, index})
  }

  /**
   * Check if asset master has scan in the asset transfer
   */
  isAlreadyExistsAssetMaster = (assetNo) => {
    const { detailData } = this.state;
    const assetTransferDetailTbls = (detailData && detailData.assetTransferDetailTbls) || [];
    let listAssetMaster;
    for (let i = 0; i < assetTransferDetailTbls.length; i++) {
      listAssetMaster = assetTransferDetailTbls[i].assetTransferRequestDetailVOS || [];
      if (listAssetMaster.findIndex(el => el.assetNo === assetNo) !== -1) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if scanning asset master valid or not.
   * Asset category must be the same with asset category from the asset request
   * @param {Object} data 
   * @param {Integer} assetRequestDetailIndex
   */
  isValidAssetCategory = (data, assetRequestMasterDetail) => {
    const assetRequestCategory = (assetRequestMasterDetail && assetRequestMasterDetail.assetCategory) || '';
    const { t } = this.props;
    if (assetRequestCategory && data.assetCategory !== assetRequestCategory) {
      showMessage(
        t(MESSAGE.AST.ASSET_CATEGORY_NOT_MATCH).replace('%ASSET_CODE%', data.assetNo)
        .replace('%ASSET_CATEGORY%', assetRequestCategory)
      );
      return false;
    }
    return true;
  }

  /**
   * Check if plant of asset if valid or not
   * @param {Object} data 
   * @param {Object} detailData 
   * @returns Boolean
   */
  isValidAssetPlant = (data, detailData) => {
    const { t } = this.props;
    const { branchCodeFrom, assetTransferType } = detailData; 
    if (assetTransferType === ATConstant.typeValue.assetLendingReturn) {
      if (detailData.branchCodeFrom !== data.plantBbs) {
        showMessage(t(MESSAGE.AST.ASSET_LENDING_RETURN_PLANT_NOT_MATCH).replace('%ASSET_CODE%', data.assetNo));
        return false;
      }
    } else if (assetTransferType !== ATConstant.typeValue.branchOpening && detailData.branchCodeFrom !== data.plant) {
      showMessage(t(MESSAGE.AST.PLANT_NOT_MATCH).replace('%ASSET_CODE%', data.assetNo));
      return false;
    }

    return true;
  }

  /**
   * Check if scanning asset master valid or not.
   * @param {Object} data 
   * @param {Integer} assetRequestDetailIndex
   */
  isValidAssetMaster = (data, assetRequestDetailIndex) => {
    const { t } = this.props;
    const { detailData } = this.state;
    const { assetTransferDetailTbls } = detailData;
    const assetRequestMasterList = (assetTransferDetailTbls[assetRequestDetailIndex] && assetTransferDetailTbls[assetRequestDetailIndex].assetRequestMaster) || [];
    const assetRequestMasterIndex = assetRequestMasterList.findIndex(el => el.assetRequestDetailId === data.assetRequestDetailId);
    return this.isValidAssetCategory(data, assetRequestMasterList[assetRequestMasterIndex])
      && this.isValidAssetPlant(data, detailData || {});
  }

  getDataScaning = (data, id, assetRequestMasterId, index) => {
    const { t } = this.props;
    const { detailData } = this.state;
    const typeChange = detailData.assetTransferType || '';
    if (this.isAlreadyExistsAssetMaster(data)) {
      showMessage(t(MESSAGE.AST.DUPLICATE_ASSET_MASTER).replace('%ASSET_CODE%', data));
      return;
    }
    getDataScanning({
      assetNo: data
    }).then(res => {
      const assetTransferDetailTbls = detailData.assetTransferDetailTbls || [];
      let dataScan;
      if (getErrorMessage(res)) {
        showMessage(getErrorMessage(res));
        return;
      }
      // Start to check if scan data is valid or not
      dataScan={
        ...res.data,
        assetNo: data,
        assetRequestDetailId: assetRequestMasterId,
        assetLocationCode: (typeChange === ATConstant.typeValue.assetLending
          || typeChange === ATConstant.typeValue.location) ? '' : res.data.assetLocationCode
      };
      if (!this.isValidAssetMaster(dataScan, index)) {
        return;
      }
      if (typeChange === ATConstant.typeValue.fromAR) {
        assetTransferDetailTbls[index].assetTransferRequestDetailVOS.push({...dataScan});
        this.setState({
          detailData: {
            ...detailData,
            assetTransferDetailTbls
          }
        });
      } else {
        let tbls = assetTransferDetailTbls ? [...assetTransferDetailTbls] : [];
        dataScan = {
          ...res.data,
          assetLocationCode: (typeChange === ATConstant.typeValue.assetLending
            || typeChange === ATConstant.typeValue.location) ? '' : res.data.assetLocationCode
        };
        if (tbls[0]) {
          tbls[0].assetTransferRequestDetailVOS.push(dataScan);
        } else {
          tbls = [{
            assetTransferRequestDetailVOS: [dataScan]
          }];
        }
        this.setState({
          detailData: {
            ...detailData,
            assetTransferDetailTbls: tbls
          },
        });
      }
    })
  } 

  // Show screen scan QR Code
  scanCodeQR = () =>{
    const {navigation} = this.props;
    const {assetRequestMasterId, index} = this.state;
    const typeChange = this.state.detailData && this.state.detailData.assetTransferType;
    navigation.navigate('CodeScan', {
      // This function callback onChange when goBack event active
      onGoBack: data =>{
        if(typeChange === ATConstant.typeValue.fromAR){
          this.getDataScaning(data, id = 1, assetRequestMasterId, index) ;// Id is Item id
        }
        else{
          this.getDataScaning(data, id = 1) ;// Id is Item id
        }
       // Auto call scan after 2 seconds
       setTimeout(this.scanCodeQR, 2000);
      }
    });
  }

  shoppingCart = () =>{
    console.log('shoppingCart')
  }

  changeFieldStep = (event, indexUpdate, indexAssetRequest) =>{
    const {detailData} = this.state;
    const typeChange = detailData && detailData.assetTransferType;
    const {name, value} = event.target;
    const assetTransferDetailTbls = detailData.assetTransferDetailTbls;
    assetTransferDetailTbls[indexAssetRequest].assetTransferRequestDetailVOS[indexUpdate][name] = value;
    this.setState({
      detailData: {
        ...detailData,
        assetTransferDetailTbls: assetTransferDetailTbls,
      }
    });
  }

  // Remove the scanned asset master from the asset transfer detail
  deleteAssetMaster = (assetMasterData, assetRequestNo) => {
    const { detailData } = this.state;
    const assetTransferDetailTbls = (detailData && detailData.assetTransferDetailTbls) || [];
    if (assetRequestNo) {
      // In case type is "Asset request", remove the asset master for the associate asset request
      const assetRequestIndex = assetTransferDetailTbls.findIndex(item => item.assetRequestNo === assetRequestNo);
      if (assetTransferDetailTbls[assetRequestIndex]) {
        const assetTransferRequestDetailVOS = assetTransferDetailTbls[assetRequestIndex].assetTransferRequestDetailVOS;
        const assetMasterIndex =  assetTransferRequestDetailVOS.findIndex(
          item => item.assetMasterId === assetMasterData.assetMasterId && item.assetRequestDetailId === assetMasterData.assetRequestDetailId
        );
        assetMasterIndex !== -1 && assetTransferRequestDetailVOS.splice(assetMasterIndex, 1);
      }
    } else {
      // In case type is different form "Asset Request", there is only 1 object in tbls array
      // So only need to remove the asset master from the first item in tbls
      const assetTransferRequestDetailVOS = assetTransferDetailTbls[0].assetTransferRequestDetailVOS;
      const assetMasterIndex =  assetTransferRequestDetailVOS.findIndex(
        item => item.assetMasterId === assetMasterData.assetMasterId && item.assetRequestDetailId === assetMasterData.assetRequestDetailId
      );
      assetMasterIndex !== -1 && assetTransferRequestDetailVOS.splice(assetMasterIndex, 1)
    }

    this.setState({
      detailData: {
        ...this.state.detailData,
        assetTransferDetailTbls
      }
    });
  }

  render() {
    const {navigation} = this.props;
    const {detailData} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <DetailForm
          isCustomButtonHeader = {true}
          customButtonStep = {customButtonStep(this.scanCodeQR, this.shoppingCart)}
          configStep={this.state.configStep(
            this.state.detailData || {},
            this.state.listComboboxData,
            this.onARNoChange.bind(this),
            this.onARNoAddIconClick.bind(this),
            this.onRemoveAssetRequestNo.bind(this),
            this.changeFieldStep,
            detailData && detailData.assetTransferType,
            this.onPressMasterId,
            this.deleteAssetMaster.bind(this)
          )}
          navigation={navigation}
          onFieldChange={this.onFieldChange}
          validationSchema={this.state.validationSchema}
          detailData={this.state.detailData}
          bottomActionNextBtnConfig={bottomActionNextBtnConfig}
          handleForSaveButton={this.handleForSaveButton}
          disabledBackBtnFromMainView={false}
          screenList={'AssetTransferList'}
          handleForFullWidthButton={this.handleForSubmitButton}
        />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(AssetTransferAddEdit);
