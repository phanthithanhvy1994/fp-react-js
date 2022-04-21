import React from 'react';
import {withTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native';
import DetailForm from '../../shared/detail-form/DetailForm';
import {MESSAGE} from '../../../constants/message';
import {showMessage, getErrorMessage} from '../../../utils/message-util';
import {
  loadAssetTransferDetail,
  getDataScanning,
} from '../../../actions/asset-transfer-action';
import {
  saveAssetTracking,
  getAssetTrackingDetail,
} from '../../../actions/asset-transfer-tracking-action';
import {styles} from './AssetTransferTrackingAddEdit.style';
import {Action} from '../../../constants/constants';
import {
  configStep,
  validationSchema,
  customButtonStep,
  bottomActionNextBtnConfig,
} from './AssetTransferTrackingAddEdit.config';

class AssetTransferTrackingAddEdit extends React.Component {
  isViewMounted = true;

  constructor(props) {
    super(props);
    this.state = {
      loggerUser: {name: 'DNB user'},
      detailData: {},
      validationSchema: validationSchema(this.props.t),
    };
  }

  componentDidMount() {
    if (!this.isViewMounted) {
      return;
    }
    const {navigation} = this.props;
    const {isEditPage, assetTrackingId} =
      (navigation.state && navigation.state.params) || {};

    if (isEditPage) {
      this.loadATData(assetTrackingId);
    }
  }

  loadATData = assetTrackingId => {
    getAssetTrackingDetail({id: assetTrackingId}).then(res => {
      if (res.data) {
        const assetTransferDetailList = res.data.assetTrackingDetailVOs.map(
          item => {
            item.assetTransferDetailTbls = item.assetTrackingTranferDetailVOs;
            return item;
          },
        );
        this.setState({
          detailData: {
            ...res.data,
            assetTransferDetailList: assetTransferDetailList,
            listATNo: res.data.assetTrackingDetailVOs?.map(
              el => el.assetTransferNo,
            ),
          },
        });
      }
    });
  };

  onATNoAddIconClick = () => {
    const {detailData} = this.state;
    const atNoVal =
      detailData.assetTransferNo && detailData.assetTransferNo.trim();
    const listATNo = detailData.listATNo || [];

    if (!atNoVal) {
      return;
    }

    // DOn't allow re-add if it has been already added into list
    if (listATNo.indexOf(atNoVal) !== -1) {
      showMessage(
        MESSAGE.ASSET_TRANSFER_TRACKING.DUPLICATE_AT_NO.replace(
          '<Asset_Code>',
          atNoVal,
        ),
      );
      return;
    }

    loadAssetTransferDetail({
      transferNo: atNoVal,
    }).then(res => {
      let assetTransferDetailList = detailData.assetTransferDetailList || [];
      const errorMsg = getErrorMessage(res);

      if (errorMsg) {
        showMessage(errorMsg);
        return;
      }
      assetTransferDetailList = assetTransferDetailList.concat(res.data);
      listATNo.push(atNoVal);
      this.setState({
        detailData: {
          ...this.state.detailData,
          listATNo,
          assetTransferDetailList,
        },
      });
    });
  };

  onRemoveAssetTransferNo = (value, index) => {
    const removeAT = (value, index) => {
      const {detailData} = this.state;
      let listATNo = detailData?.listATNo || [];

      listATNo = listATNo.filter((tempVal, tempIndex) => index !== tempIndex);
      const assetTransferDetailList = detailData.assetTransferDetailList.filter(
        el => el.assetTransferNo !== value,
      );
      this.setState({
        detailData: {
          ...detailData,
          listATNo: (listATNo.length > 0 && listATNo) || [],
          assetTransferDetailList,
        },
      });
    };

    if (this.isConfirmed(value)) {
      showMessage(
        MESSAGE.ASSET_TRANSFER_TRACKING.CONFIRM_DELETE,
        () => removeAT(value, index),
        true,
      );
    } else {
      removeAT(value, index);
    }
  };

  isConfirmed = assetTransferNo => {
    const {detailData} = this.state;
    const assetTransferDetailList = detailData?.assetTransferDetailList || [];
    let isConfirmed = false;

    for (let i = 0; i < assetTransferDetailList.length; i++) {
      if (assetTransferNo === assetTransferDetailList[i].assetTransferNo) {
        const assetTransferDetailTbls = assetTransferDetailList[i].assetTransferDetailTbls.filter(el => el.confirmed);

        if (assetTransferDetailTbls.length > 0) {
          isConfirmed = true;
          break;
        }
      }
    }
    return isConfirmed;
  };

  onFieldChange = event => {
    const {value, name} = event.target;
    const {detailData} = this.state;

    if (!this.isViewMounted) {
      return;
    }
    this.setState({
      detailData: {
        ...detailData,
        [name]: value,
      },
    });
  };

  onChangeConfirmed = event => {
    const {value, name} = event.target;
    const fieldInfo = name && name.split('-');
    const newDetailData = {...this.state.detailData};

    if (newDetailData?.assetTransferDetailList) {
      newDetailData.assetTransferDetailList[+fieldInfo[1]].assetTransferDetailTbls[+fieldInfo[2]][fieldInfo[0]] = value;
    }
    this.setState({
      detailData: newDetailData,
    });
  };

  scanAssetCodeQR = () => {
    const {navigation} = this.props;

    navigation.navigate('CodeScan', {
      // This function callback onChange when goBack event active
      onGoBack: data => {
        this.getAssetCodeScanned(data);
        // Auto call scan after 2 seconds
        setTimeout(this.scanAssetCodeQR, 2000);
      },
    });
  };

  getAssetCodeScanned = data => {
    const newDetailData = {...this.state.detailData};

    // Check asset code scanned exist in DB
    getDataScanning({assetNo: data}).then(res => {
      const errorMsg = getErrorMessage(res);

      if (errorMsg) {
        showMessage(errorMsg);
        return;
      }

      newDetailData?.assetTransferDetailList.map(assetTransfer =>
        assetTransfer?.assetTransferDetailTbls.map(item => {
          if (item?.assetMasterTbl?.assetNo === data) {
            item.confirmed = true;
          }
          return item;
        }),
      );
      this.setState({
        detailData: newDetailData,
      });
    });
  };

  handleForConfirmButton = () => {
    return this.handleSave(Action.confirm);
  };

  handleForSaveButton = () => {
    return this.handleSave(Action.save);
  };

  handleSave = typeSubmit => {
    const {navigation, t} = this.props;
    const {isEditPage, assetTrackingId} =
      (navigation.state && navigation.state.params) || {};
    const data = this.state.detailData || {};
    const detailData = this.formatDataSave(data);

    detailData.notes = data.notes || '';

    if (isEditPage) {
      detailData.assetTrackingId = assetTrackingId;
    }

    return new Promise((resolve, reject) => {
      saveAssetTracking(detailData, typeSubmit).then(res => {
        if (getErrorMessage(res)) {
          showMessage(getErrorMessage(res));
          reject();
          return;
        }
        const {t} = this.props;
        const msg = t(typeSubmit === Action.save ?
          (isEditPage ? 'updateAssetTrackingSuccessfully' : 'saveAssetTrackingSuccessfully')
          : 'submitAssetTrackingSuccessfully').replace('%ASK_No%', res.data || '<ASK_No>');

        showMessage(msg,
          () => {
            resolve();
            navigation.navigate('AssetTransferTrackingList');
          },
        );
      });
    });
  };

  formatDataSave = data => {
    const resultData = data?.assetTransferDetailList?.map(item => {
      const assetTrackingTranferDetailVOs = item.assetTransferDetailTbls.map(
        assetTracking => ({
          assetTransferRequestDetailId: assetTracking.assetTransferRequestDetailId,
          selected: Number(assetTracking.confirmed) || 0,
        }),
      );

      return {
        assetTransferNo: item.assetTransferNo,
        assetTrackingTranferDetailVOs: assetTrackingTranferDetailVOs,
      };
    });

    return {assetTrackingDetailVOs: resultData || []};
  };

  componentWillUnmount() {
    this.isViewMounted = false;
  }

  render() {
    const {navigation} = this.props;
    const {detailData, loggerUser, validationSchema} = this.state;

    return (
      <>
        {this.isViewMounted && (
          <SafeAreaView style={styles.mainView}>
            <DetailForm
              customButtonStep={customButtonStep(this.scanAssetCodeQR)}
              isCustomButtonHeader={true}
              // Config custom button in Step 2 - Confirmed
              bottomActionNextBtnConfig={bottomActionNextBtnConfig}
              // Button Save in Step 2
              handleForSaveButton={this.handleForSaveButton}
              // Handle custom button in Step 2 - Confirmed
              handleForFullWidthButton={this.handleForConfirmButton}
              configStep={configStep(
                detailData || {},
                loggerUser,
                this.onFieldChange,
                this.onATNoAddIconClick,
                this.onRemoveAssetTransferNo,
                this.onChangeConfirmed,
              )}
              navigation={navigation}
              onFieldChange={this.onFieldChange}
              detailData={detailData}
              validationSchema={validationSchema}
              screenList={'AssetTransferTrackingList'}
            />
          </SafeAreaView>
        )}
      </>
    );
  }
}
export default withTranslation()(AssetTransferTrackingAddEdit);
