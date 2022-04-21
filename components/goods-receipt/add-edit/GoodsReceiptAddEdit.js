import React from 'react';
import { SafeAreaView, View } from 'react-native';
import DetailForm from '../../shared/detail-form/DetailForm';
import { withTranslation } from 'react-i18next';

import {
  configStep,
  attachedImagesField,
  bottomActionNextBtnConfig,
  validationPOSchema,
  validationDOSchema,
  lastViewFields,
  tempArr,
  validationErrorConfigForLastView,
  sndField,
} from './goods-receipt-add-edit.config';
import {
  getGRScanningData,
  saveGoodsReceipt,
  submitGoodsReceipt,
  uploadGRImages,
  getDataPOById,
  getDataDOById,
  getGoodsReceiptDetailsById,
  updateGoodsReceipt,
  getGRDeliveryType,
  editGoodsReceipt,
} from '../../../actions/goods-receipt-action';
import {
  dateFormat,
  GRConstant,
  buttonConstant,
  dialogConstant,
} from '../../../constants/constants';

import { styles } from './GoodsReceiptAddEdit.style';
import { formatDateString, convertSubmittedTime } from '../../../utils/date-util';
import { formatComboBox } from '../../../utils/format-util';
import { onChangeInput, trimContent } from '../../../utils/functions';
import { showMessage, getErrorMessage } from '../../../utils/message-util';
import isEmpty from 'lodash/isEmpty';
import Field from '../../shared/fields/field';
import Header from '../../core/HeaderComponent';
import CustomSecondStep from './CustomStep/CustomSecondStep';

import { MESSAGE } from '../../../constants/message';
import { openMessageDialog } from '../../../redux/message-dialog/MessageDialog.actions';
import moment from 'moment';

class GoodsReceiptAddEdit extends React.Component {
  isViewMounted = true;
  constructor(props) {
    super(props);
    this.state = {
      checkDisable: true,
      isBranchPOType: false,
      isValidInformation: false,
      lastViewFieldsArr: [],
      attachedImagesFieldArr: attachedImagesField,
      detailID: '',
      listMaterial: [],
      listMaterialForProduct1: [],
      listMaterialForProduct2: [],
      listMaterialForProduct3: [],
      goodsReceiptId: '',
      deliveryTypeData: [],
      tempViewFieldsArr: [],
      dataSecondStep: {},
      isEditPage: false,
      configStep,
      lastViewErrors: {},
      ignoreValidationSchema: false,
    };
    this.detailForm = React.createRef();
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (!this.isViewMounted) {
      return;
    }
    if (navigation.state.params) {
      this.isViewMounted &&
        this.updateEditData(navigation.state.params.detailsInfo);
    }
  }

  componentWillUnmount() {
    this.isViewMounted = false;
  }

  updateEditData = data => {
    let isBranchPO = !data.doNumber;
    let configTime = '';
    if (!isBranchPO) {
      configTime = {
        minute: data.remainingTime.substring(3, 5) || '60',
        second: data.remainingTime.substring(6, 9) || '00',
      };
    }
    const stepTime = [
      data.submittedTime1 && convertSubmittedTime(data.submittedTime1),
      data.submittedTime2 && convertSubmittedTime(data.submittedTime2),
    ];
    this.setState({
      detailData: {
        ...this.state.detailData,
        ...data,
      },
      isValidInformation: true,
      disableFld: true,
      isEditPage: true,
      isBranchPOType: isBranchPO,
      goodsReceiptId: data.goodsReceiptId,
      receiptNumber: data.receiptNumber,
      ignoreValidationSchema: false,
      stepTime: stepTime,
      configTime: configTime,
      detailID: data.id,
    });
  };
  onFieldChange = event => {
    const { value, name, fldName } = event.target;
    if (!this.isViewMounted) {
      return;
    }
    if (fldName && fldName === 'codeScan') {
      this.handleScanning(value);
    }
    this.setState({
      detailData: {
        ...this.state.detailData,
        [name]: value,
      },
    });
  };

  // Fst Step

  handleScanning = async data => {
    const { t } = this.props;
    await getGRScanningData({ refNumber: data })
      .then(res => {
        if (res.data) {
          const { isValidInformation } = this.state;
          const isBranchPO = !res.data.doNumber;
          const setData = {
            detailData: {
              ...this.state.detailData,
              ...res.data,
            },
            isBranchPOType: isBranchPO,
            detailID: res.data.id,
            isValidInformation: true,
          };
          if (isValidInformation) {
            showMessage(
              t(MESSAGE.GR.M030203_005, { refNo: data }),
              () => {
                this.setState(setData);
              },
              true,
            );
          } else {
            this.setState(setData);
          }
        } else {
          const msg = getErrorMessage(res);
          showMessage(msg.length !== 0 ? msg : MESSAGE.GR.M030203_003);
          this.setState({
            isValidInformation: false,
          });
        }
      })
      .catch(err => {
        const msg = getErrorMessage(err);
        showMessage(msg);
      });
  };

  handleForSaveButton = step => {
    const { isValidInformation } = this.state;
    if (step === 0 && isValidInformation) {
      this.detailForm.current.getTime(this.handleSaveFstStep);
    }
    if (step === 1) {
      this.detailForm.current.getTime(this.handleSaveSndStep);
    }
    return Promise.reject();
  };

  handleSaveFstStep = (submittedTime, remainingTime) => {
    const date = moment().format(dateFormat.yyyymmdd);
    const {
      detailData,
      isBranchPOType,
      isEditPage,
      goodsReceiptId,
      detailID,
      isCompleteFstStep,
    } = this.state;
    const params = (detailData && detailData) || {};

    params.submittedTime1 = formatDateString(
      `${date} ${submittedTime}`,
      dateFormat.savingDateTime,
      false,
    );
    if (!isBranchPOType) {
      params.remainingTime = formatDateString(
        `${date} ${remainingTime}`,
        dateFormat.savingDateTime,
        false,
      );
      params.poNumber = null;
    } else {
      params.remainingTime = '';
      params.deliveryNote = trimContent(detailData.deliveryNote);
    }
    params.note = (detailData.note && trimContent(detailData.note)) || '';
    params.createdDate = formatDateString(
      date,
      dateFormat.savingDateTimeStartDate,
      false,
    );
    if (isEditPage || isCompleteFstStep) {
      params.goodsReceiptId = goodsReceiptId;
      params.goodReceiptTypeCode = '';
      editGoodsReceipt(params)
        .then(resEdit => {
          if (resEdit.data) {
            this.getDataSecondStep(resEdit.data.id, isBranchPOType);
            this.detailForm.current.setRenderNextComponent(submittedTime);
            this.setState({ disableFld: true });
          } else {
            showMessage(getErrorMessage(res));
          }
        })
        .catch(err => {
          const msg = getErrorMessage(err);
          showMessage(msg);
        });
    } else {
      saveGoodsReceipt(params)
        .then(res => {
          if (res.data) {
            this.setState({
              goodsReceiptId: res.data.goodsReceiptId,
              goodsReceiptNo: res.data.receiptNumber,
              disableFld: true,
              isCompleteFstStep: true,
            });
            this.getDataSecondStep(detailID, isBranchPOType);
            this.detailForm.current.setRenderNextComponent(submittedTime);
          } else {
            showMessage(getErrorMessage(res));
          }
        })
        .catch(err => {
          const msg = getErrorMessage(err);
          showMessage(msg);
        });
    }
  };

  handleSubmitScanning = () => {
    const { detailData } = this.state;
    if (detailData && detailData.refNumber !== '') {
      this.handleScanning(detailData.refNumber);
    }
  };

  getDetailSndStep = async (id, isBranchPOType) => {
    const pathUrl = isBranchPOType
      ? getDataPOById({ poRequestId: id })
      : getDataDOById({ id: id });
    await pathUrl.then(res => {
      if (res.data) {
        const formatRes = {};
        formatRes.goodsReceiptItemVOS = res.data.goodsReceiptItemVOS.map(
          item => ({
            itemVO: { ...item.itemVO, qty: '0' },
          }),
        );
        let setValueState = { dataSecondStep: formatRes };
        if (!isBranchPOType) {
          getGRDeliveryType().then(resData => {
            this.setState({
              ...setValueState,
              deliveryTypeData: formatComboBox(
                resData.data.filter(
                  el => el.typeCode !== GRConstant.deliveryType.fullReceive,
                ),
              ),
            });
          });
        } else {
          this.setState({
            ...setValueState,
          });
        }
      }
    });
  };

  // Second step
  getDataSecondStep = async (id, isBranchPOType) => {
    const { isEditPage, goodsReceiptId, detailID } = this.state;
    if (isEditPage) {
      await getGoodsReceiptDetailsById({ id: goodsReceiptId })
        .then(res => {
          if (res.data.goodsReceiptItems) {
            const formatRes = {};
            formatRes.goodsReceiptItemVOS = res.data.goodsReceiptItems.map(
              item => ({
                itemVO: item,
              }),
            );
            getGRDeliveryType().then(resData => {
              this.setState({
                dataSecondStep: formatRes,
                deliveryTypeData: formatComboBox(
                  resData.data.filter(
                    el => el.typeCode !== GRConstant.deliveryType.fullReceive,
                  ),
                ),
              });
            });
          } else {
            this.getDetailSndStep(detailID, isBranchPOType);
          }
        })
        .catch(err => {
          const msg = getErrorMessage(err);
          showMessage(msg);
        });
    } else {
      this.getDetailSndStep(id, isBranchPOType);
    }
  };

  getDataStep2 = data => {
    this.setState({ dataSndStep: data });
  };

  handleRenderLastStep = data => {
    const { detailData, isBranchPOType } = this.state;
    const goodsReceiptId = data.goodsReceiptId;
    const ignoreValidationSchema = true;

    const listMaterial = data.goodsReceiptItems.map((item, index) => ({
      display: item.description,
      value: item.sku,
      id: index,
    }));

    // Disabled quantity field temperature2 base on value of productTemperature2 selected box
    let newDetailData = this.convertNewDataByLastViewFields(lastViewArr);

    // Disabled Product Temp 2 field if just has 1 item
    const disabledProductTemp2 = listMaterial.length === 1;
    const disabledProductTemp3 = listMaterial.length === 1 || listMaterial.length === 2;

    const disabledTemperature1 = !newDetailData.sku1;
    const disabledTemperature2 = !newDetailData.sku2;
    const disabledTemperature3 = !newDetailData.sku3;

    const listMaterialForProduct1 = listMaterial;
    const listMaterialForProduct2 = listMaterial;
    const listMaterialForProduct3 = listMaterial;

    const lastViewArr = lastViewFields(
      detailData,
      isBranchPOType,
      listMaterial,
      listMaterialForProduct1,
      listMaterialForProduct2,
      disabledProductTemp2,
      listMaterialForProduct3,
      disabledProductTemp3,
    );

    const tempFieldsArr = tempArr(
      detailData,
      isBranchPOType,
      listMaterial,
      disabledTemperature1,
      disabledTemperature2,
      disabledTemperature3,
    );

    this.setState({
      lastViewFieldsArr: [...lastViewArr],
      listMaterial: listMaterial,
      tempViewFieldsArr: tempFieldsArr,
      isBranchPOType,
      detailData: newDetailData,
      goodsReceiptId,
      ignoreValidationSchema,
    });
  };
  handleSaveSndStep = (submittedTime, remainingTime) => {
    const date = moment().format(dateFormat.yyyymmdd);
    const {
      goodsReceiptId,
      isBranchPOType,
      dataSndStep,
      isEditPage,
    } = this.state;
    let formatParam = {};
    formatParam.goodsReceiptId = goodsReceiptId;
    formatParam.submittedTime2 = formatDateString(
      `${date} ${submittedTime}`,
      dateFormat.savingDateTime,
      false,
    );
    formatParam.goodsReceiptItems = [];
    let msg = [];
    dataSndStep.map(item => {
      let param = {
        isReceived: item.itemVO.isReceived ? 1 : 0,
      };
      let quantity = isEditPage
        ? isBranchPOType
          ? +item.itemVO.quantity
          : +item.itemVO.adjQty
        : +item.itemVO.qty;
      let checkError =
        quantity === 0 &&
        (!isBranchPOType
          ? !isEmpty(item.itemVO.deliveryType)
          : param.isReceived);
      if (checkError) {
        msg.push(item.itemVO.sku);
      }

      if (!isBranchPOType) {
        param.deliveryType = +item.itemVO.deliveryType
          ? +item.itemVO.deliveryType
          : null;
        param.receivedQty = +item.itemVO.deliveredQty;
        param.deliveredQty = +item.itemVO.deliveredQty;
        param.adjQty = quantity;
        formatParam.remainingTime = formatDateString(
          `${date} ${remainingTime}`,
          dateFormat.savingDateTime,
          false,
        );
      } else {
        param.receivedQty = quantity;
        param.deliveredQty = +item.itemVO.quantity;
        param.lineNumber = item.itemVO.lineNumber;
      }

      param.sku = item.itemVO.sku;
      formatParam.goodsReceiptItems.push(param);
    });
    if (msg.length !== 0) {
      showMessage(
        MESSAGE.GR.ADJ_QUANTITY_REQUIRE_FLD.replace('{{listGRNo}}', msg),
      );
      return;
    }
    updateGoodsReceipt(formatParam)
      .then(res => {
        if (res.data) {
          this.handleRenderLastStep(res.data);
          this.detailForm.current.setRenderNextComponent(submittedTime);
        }
      })
      .catch(err => { });
  };

  renderSndStep = (
    dataSecondStep,
    deliveryTypeData,
    getDataStep2,
    isBranchPOType,
    isEditPage,
    sndField,
  ) => {
    return (
      <CustomSecondStep
        dataEdit={dataSecondStep}
        deliveryTypeData={deliveryTypeData}
        getDataForStep2={getDataStep2}
        isBranchPOType={isBranchPOType}
        isEditPage={isEditPage}
        sndField={sndField}
      />
    );
  };

  //Last Step
  handleSubmit = () => {
    const { fieldsLabelArray } = this.state;
    const fieldsLabel = fieldsLabelArray;
    fieldsLabel.fstStep.forEach(item => {
      const field = item;
      if (field.value && field.fieldType === FieldConstant.type.RECIPIENT) {
        this.handleScanning(field.value);
      }
    });
  };

  lastStepFieldChange = (e, arrName) => {
    const { lastViewFieldsArr, tempViewFieldsArr, listMaterial } = this.state;
    const { value, name } = e.target;
    let newInputFields = '';
    let newTempViewFields = '';
    if (arrName === 'tempList') {
      const cloneTarget = {
        target: { value: value.toString() || '', name: name },
      };
      newInputFields = onChangeInput(tempViewFieldsArr, cloneTarget);
      this.setState({ tempViewFieldsArr: newInputFields });
    } else {
      newInputFields = onChangeInput([...lastViewFieldsArr], e);

      // Disabled quantity field temperature2 base on value of productTemperature2 selected box
      newTempViewFields = [...tempViewFieldsArr];

      // Disabled temperature field base on value of selected Product Temperature
      newTempViewFields[0].disabled = !newInputFields[0].value;
      newTempViewFields[1].disabled = !newInputFields[1].value;
      newTempViewFields[2].disabled = !newInputFields[2].value;

      const productTemp1Val = newInputFields[0].value;
      const productTemp2Val = newInputFields[1].value;
      const productTemp3Val = newInputFields[2].value;

      // Hanlde for update data of Product Temperature combobox 1, 2, 3
      // Once the combobox selects a record, the other combobox will only contain value except the selected value 
      newInputFields[0].data = listMaterial.filter(
        el => (el.value !== productTemp2Val && el.value !== productTemp3Val),
      );

      newInputFields[1].data = listMaterial.filter(
        el => (el.value !== productTemp1Val && el.value !== productTemp3Val),
      );

      newInputFields[2].data = listMaterial.filter(
        el => (el.value !== productTemp1Val && el.value !== productTemp2Val),
      );

      // convert to new detailData
      const newDetailData = this.convertNewDataByLastViewFields(newInputFields);
      this.clearErrorForLastView(newDetailData);
      this.setState({
        lastViewFieldsArr: newInputFields,
        tempViewFieldsArr: newTempViewFields,
        detailData: newDetailData,
      });
    }
  };

  convertNewDataByLastViewFields = fieldArr => {
    const { detailData } = this.state;

    let newDetailData = {};
    if (fieldArr && fieldArr.length) {
      fieldArr.map(item => {
        const { fieldName, value } = item;
        newDetailData[fieldName] = value;
      });
    }

    return { ...detailData, ...newDetailData };
  };

  handleUploadImg = e => {
    const { attachedImagesFieldArr } = this.state;
    const newInputFields = onChangeInput(attachedImagesFieldArr, e);
    this.setState({ attachedImagesFieldArr: newInputFields });
  };

  getFilename = url => {
    return url.substr(url.lastIndexOf('/') + 1);
  };

  handleSubmitGR = formatParam => {
    const { listMaterial, isBranchPOType } = this.state;

    let temperatureMsg = [];
    let productTempMsg = [];

    const isEmptyProductTemp1 = isEmpty(formatParam.goodsReceiptItems[0].sku.toString());
    const isEmptyProductTemp2 = isEmpty(formatParam.goodsReceiptItems[1].sku.toString());
    const isEmptyProductTemp3 = isEmpty(formatParam.goodsReceiptItems[2].sku.toString());

    const isEmptyTemp1 = isEmpty(formatParam.goodsReceiptItems[0].temperature1.toString());
    const isEmptyTemp2 = isEmpty(formatParam.goodsReceiptItems[1].temperature2.toString());
    const isEmptyTemp3 = isEmpty(formatParam.goodsReceiptItems[2].temperature3.toString());

    const isHasOneItem = listMaterial.length === 1;
    const isHasTwoItems = listMaterial.length === 2;
    const isHasThreeItems = listMaterial.length === 3;

    // validation for DO type
    if (isBranchPOType === false) {
      // Handle validation for detail info has 1 item, 2 items and 3 items
      // The number of required fields will be based on the number of items in detail info
      if ((isHasOneItem || isHasTwoItems || isHasThreeItems) && isEmptyProductTemp1) {
        productTempMsg.push(1);
      }

      if ((isHasOneItem || isHasTwoItems || isHasThreeItems) && isEmptyTemp1) {
        temperatureMsg.push(1);
      }

      if ((isHasTwoItems || isHasThreeItems) && isEmptyProductTemp2) {
        productTempMsg.push(2);
      }

      if ((isHasTwoItems || isHasThreeItems) && isEmptyTemp2) {
        temperatureMsg.push(2);
      }

      if (isHasThreeItems && isEmptyProductTemp3) {
        productTempMsg.push(3);
      }

      if (isHasThreeItems && isEmptyTemp3) {
        temperatureMsg.push(3);
      }
    } else {
      // validation for Branch PO type
      // Do not require Product Temperature field
      // But Temperature field will be required if Product Temperature field is selected
      if (!isEmptyProductTemp1 && isEmptyTemp1) {
        temperatureMsg.push(1);
      }

      if (!isEmptyProductTemp2 && isEmptyTemp2) {
        temperatureMsg.push(2);
      }

      if (!isEmptyProductTemp3 && isEmptyTemp3) {
        temperatureMsg.push(3);
      }
    }

    if (productTempMsg.length !== 0) {
      showMessage(
        MESSAGE.GR.PRODUCT_TEMPERATURE_REQUIRE_FLD.replace('{{listGRNo}}', productTempMsg),
      );
      return;
    }

    if (temperatureMsg.length !== 0) {
      showMessage(
        MESSAGE.GR.TEMPERATURE_REQUIRE_FLD.replace('{{listGRNo}}', temperatureMsg),
      );
      return;
    }

    submitGoodsReceipt(formatParam)
      .then(res => {
        let msg = [];
        if (res.message && res.message.messages && res.message.messages.length) {
          const msgSAPOject = res.message?.messages[0]?.errorSAPRestVO;
          if (isEmpty(msgSAPOject)) {
            const errorMsg = getErrorMessage(res);
            msg.push(errorMsg);
          } else {
            res.message?.messages?.map(item => {
              msg.push(
                `-${item.errorSAPRestVO?.MESSAGE} ${item.errorSAPRestVO?.FIELD}`
              );
            });
          }
        } else {
          if (res.data) {
            msg.push(`Material Document: ${res.data?.MAT_DOC}`);
          }
        }

        openMessageDialog({
          content: msg.join('\n'),
          buttons: [
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.FUNCTION,
              action: () => {
                this.props.navigation.navigate('GoodsReceiptList');
              },
            },
          ],
        });
      })
      .catch(err => {
        const msg = getErrorMessage(err);
        showMessage(msg);
        return;
      });
  };

  confirmSaveLastStep = () => {
    const { goodsReceiptNo } = this.state;

    showMessage(
      MESSAGE.GR.SUBMIT_CONFIRM_DETAILS.replace('%INSTANCE%', goodsReceiptNo),
      this.handleSaveLastStep.bind(this),
      true,
    );
  };

  handleSaveLastStep = (submittedTime, remainingTime) => {
    const date = moment().format(dateFormat.yyyymmdd);
    const {
      lastViewFieldsArr,
      attachedImagesFieldArr,
      tempViewFieldsArr,
      isBranchPOType,
      goodsReceiptId,
    } = this.state;
    const params = {};
    lastViewFieldsArr.forEach(el => {
      params[el.fieldName] =
        typeof el.value === 'string' ? el.value.trim() : el.value;
    });
    tempViewFieldsArr.forEach(el => {
      params[el.fieldName] =
        typeof el.value === 'string' ? el.value.trim() : el.value;
    });
    const formatParam = {};
    formatParam.goodsReceiptId = goodsReceiptId;
    formatParam.submittedTime = formatDateString(
      `${date} ${submittedTime}`,
      dateFormat.savingDateTime,
      false,
    );
    if (!isBranchPOType) {
      formatParam.remainingTime = formatDateString(
        `${date} ${remainingTime}`,
        dateFormat.savingDateTime,
        false,
      );
    }
    formatParam.goodsReceiptItems = [
      {
        sku: params.sku1,
        temperature1: params.productTemperature1,
      },
      { sku: params.sku2, temperature2: params.productTemperature2 },
      { sku: params.sku3, temperature3: params.productTemperature3 },
    ];
    let goodsReceiptImages = [];
    attachedImagesFieldArr.forEach(item => {
      item.value.forEach(img => {
        let formatImg = img;
        formatImg.fileName = this.getFilename(img.path);
        goodsReceiptImages.push(formatImg);
      });
    });
    if (goodsReceiptImages.length !== 0) {
      let formData = new FormData();
      goodsReceiptImages.forEach(image => {
        const file = {
          uri: image.path,
          name: image.fileName,
          type: image.mime,
        };
        formData.append('file', file);
      });
      uploadGRImages(formData)
        .then(res => {
          if (res.message) {
            const errorMsg = getErrorMessage(res);
            showMessage(errorMsg);
            return;
          }

          formatParam.goodsReceiptImages = [];
          res.data.forEach(item => {
            formatParam.goodsReceiptImages.push({
              goodsReceiptImageId: item.goodsReceiptImageId,
            });
          });
          this.handleSubmitGR(formatParam);
        })
        .catch(err => {
          const msg = getErrorMessage(err);
          showMessage(msg);
          return;
        });
    } else {
      this.handleSubmitGR(formatParam);
    }
  };

  // Step 3
  handelForSubmitButton = step => {
    const { detailData, isBranchPOType } = this.state;
    let hasErrors = false;

    if (!isBranchPOType) {
      hasErrors = this.handleValidationErrorForLastView(detailData);
    }

    if (!hasErrors) {
      this.detailForm.current.getTime(this.confirmSaveLastStep);
    }

    return Promise.resolve();
  };

  handleValidationErrorForLastView = detailData => {
    let hasErrors = false;
    let errors = {};

    // if (!detailData.sku1) {
    //   errors.sku1 = validationErrorConfigForLastView.sku1;
    // }
    // if (!detailData.sku2) {
    //   errors.sku2 = validationErrorConfigForLastView.sku2;
    // }

    hasErrors = Object.keys(errors).length > 0;
    this.setState({ lastViewErrors: errors });
    return hasErrors;
  };

  clearErrorForLastView = detailData => {
    let errors = { ...this.state.lastViewErrors };

    if (detailData.sku1) {
      delete errors.sku1;
    }
    // if (detailData.sku2) {
    //   delete errors.sku2;
    // }

    this.setState({ lastViewErrors: { ...errors } });
  };

  renderLastStep = (fieldArr, imgArr, tempFldArr) => {
    return (
      <View style={styles.lastViewCtn}>
        <View style={styles.lastViewFieldsCtn}>
          <View style={styles.lastViewFieldsLeft}>
            <Field
              conditionalArray={fieldArr}
              onChange={e => {
                this.lastStepFieldChange(e, 'materialList');
              }}
              errors={this.state.lastViewErrors}
            />
          </View>
          <View style={styles.lastViewFieldsRight}>
            <Field
              conditionalArray={tempFldArr}
              onChange={e => this.lastStepFieldChange(e, 'tempList')}
            />
          </View>
        </View>
        <View>
          <Field
            conditionalArray={imgArr}
            onChange={e => this.handleUploadImg(e)}
          />
        </View>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const {
      checkDisable,
      isBranchPOType,
      detailData,
      disableFld,
      deliveryTypeData,
      dataSecondStep,
      lastViewFieldsArr,
      attachedImagesFieldArr,
      tempViewFieldsArr,
      ignoreValidationSchema,
      receiptNumber,
      isEditPage,
      configTime,
      stepTime,
    } = this.state;
    const header = isEditPage
      ? `Edit Goods Receipt No: ${receiptNumber}`
      : 'Create Goods Receipt';
    return (
      <SafeAreaView style={styles.container}>
        <Header title={header} />
        <DetailForm
          configStep={this.state.configStep(
            detailData || {},
            isBranchPOType,
            disableFld,
            <View>
              {this.renderSndStep(
                dataSecondStep,
                deliveryTypeData,
                this.getDataStep2,
                isBranchPOType,
                isEditPage,
                sndField,
              )}
            </View>,
            <View>
              {this.renderLastStep(
                lastViewFieldsArr,
                attachedImagesFieldArr,
                tempViewFieldsArr,
              )}
            </View>, // last step View
          )}
          navigation={navigation}
          onFieldChange={this.onFieldChange}
          detailData={detailData}
          onSubmitEditing={this.handleSubmitScanning}
          isBranchPOType={isBranchPOType}
          bottomActionNextBtnConfig={bottomActionNextBtnConfig}
          handleForSaveButton={step => this.handleForSaveButton(step)}
          handleForSubmitButton={step => this.handelForSubmitButton(step)}
          checkDisable={checkDisable}
          isDisplayRemainingTime={true}
          ref={this.detailForm}
          handleSaveFstStep={this.handleSaveFstStep}
          handleSaveSndStep={this.handleSaveSndStep}
          handleSaveLastStep={this.confirmSaveLastStep}
          validationSchema={
            !ignoreValidationSchema &&
            (isBranchPOType ? validationPOSchema : validationDOSchema)
          }
          configTime={configTime}
          stepTime={stepTime}
          isEditPage={isEditPage}
        />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(GoodsReceiptAddEdit);
