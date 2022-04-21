import React from 'react';
import { withTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';

import { View, Text, Image, SafeAreaView } from 'react-native';

import { noImage } from '../../../assets/images';
import { Button } from 'native-base';

import Header from '../../core/HeaderComponent';
import Field from '../../shared/fields/field';
import DetailForm from '../../shared/detail-form/DetailForm';

import { configStep, bottomActionNextBtnConfig, lastViewFields, deliveryTypeField, attachedImagesField } from './GoodsReceiptDetail.config';

import {
    GRConstant,
    dateFormat,
    buttonConstant,
    dialogConstant,
} from '../../../constants/constants';

import { formatDateString } from '../../../utils/date-util';

import {
    getGoodsReceiptDetailsById,
    reSubmitGoodsReceiptWithDetails,
} from '../../../actions/goods-receipt-action';

import { MESSAGE } from '../../../constants/message';
import { openMessageDialog } from '../../../redux/message-dialog/MessageDialog.actions';
import { showMessage, getErrorMessage } from '../../../utils/message-util';
import { GRDetailsStyles } from './GoodsReceiptDetail.style';

class GoodsReceiptDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsReceiptNo: '',
            goodReceiptType: '',
            goodsReceiptId: '',
            detailsData: {},
            detailsItemsData: [],
            temperatureOfItemsData: {},
            attachedImagesData: [],
            lastViewFieldsArr: lastViewFields,
            attachedImagesFieldArr: attachedImagesField,
            dataBodyForSubmit: {},
            configStep,
            detailData: {},
            isBranchPoType: false,
            status: '',
            submittedTimeArr: [],
        };
    }

    _isMounted = true;

    componentDidMount() {
        const { navigation } = this.props;
        const goodsReceiptNo = navigation.state.params.goodsReceiptNo;
        const detailsInfo = navigation.state.params.detailsInfo;
        const goodReceiptType = detailsInfo.goodReceiptType;
        const status = detailsInfo.status;
        const goodsReceiptId = detailsInfo.goodsReceiptId;

        const isBranchPoType = goodReceiptType === GRConstant.goodsReceipTypeValue.branchPoTypeCode;

        this.setState({ goodsReceiptNo, detailsData: detailsInfo, goodReceiptType, status, goodsReceiptId, isBranchPoType });
        this._isMounted && getGoodsReceiptDetailsById({
            id: goodsReceiptId,
        }).then(res => {
            const goodsReceiptItems = res.data && res.data.goodsReceiptItems;
            const goodsReceiptImages = res.data && res.data.goodsReceiptImages;
            const submittedTime1 = res.data && res.data.submittedTime1 && formatDateString(res.data.submittedTime1, dateFormat.time, true);
            const submittedTime2 = res.data && res.data.submittedTime2 && formatDateString(res.data.submittedTime2, dateFormat.time, true);

            const submittedTime = res.data && res.data.submittedTime && formatDateString(res.data.submittedTime, dateFormat.time, true);
            const submittedTimeArr = [submittedTime1, submittedTime2, submittedTime];
            const dataForTemperatureOfItems = this.getDataForTemperatureOfItems(goodsReceiptItems);
            const attachedImagesData = this.getAttachedImagesData(goodsReceiptImages);

            this.setState({
                detailsItemsData: goodsReceiptItems,
                temperatureOfItemsData: dataForTemperatureOfItems,
                attachedImagesData,
                dataBodyForSubmit: res,
                submittedTimeArr,
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getAttachedImagesData = goodsReceiptImages => {
        let imageArr = [];

        if (goodsReceiptImages && goodsReceiptImages.length) {
            imageArr = goodsReceiptImages.map((item) => ({
                path: item.imagePath
            }));
        }

        return imageArr;
    };

    getDataForTemperatureOfItems = goodsReceiptItems => {
        let temperatureData = {};

        if (goodsReceiptItems && goodsReceiptItems.length) {
            goodsReceiptItems.forEach(item => {
                if (!isEmpty(item.temperature1?.toString())) {
                    temperatureData['producTemp1'] = item.description;
                    temperatureData['temperature1'] = item.temperature1;
                }
                if (!isEmpty(item.temperature2?.toString())) {
                    temperatureData['producTemp2'] = item.description;
                    temperatureData['temperature2'] = item.temperature2;
                }
                if (!isEmpty(item.temperature3?.toString())) {
                    temperatureData['producTemp3'] = item.description;
                    temperatureData['temperature3'] = item.temperature3;
                }
            })
        }

        return temperatureData;
    };

    updateFieldsArrayByType = type => {
        if (type === GRConstant.goodsReceipTypeValue.branchPoTypeCode) {
            this.setState({ fisrtViewFieldsArr: branchPOFisrtViewFields, isBranchPoType: true });
        } else {
            this.setState({ fisrtViewFieldsArr: dOFisrtViewFields, isBranchPoType: false });
        }
    };

    handleErrorMessage = res => {
        const msgObject = res.message;
        const msgArr = msgObject && msgObject.messages;
        const msgContent = msgArr && msgArr[0].messageContent;

        openMessageDialog({
            content: msgContent,
            buttons: [
                {
                    name: buttonConstant.BUTTON_OK,
                    type: dialogConstant.button.FUNCTION,
                    action: () => this.props.navigation.navigate('GoodsReceiptList'),
                },
            ],
        });
    };

    handleCancel = () => {
        const msg = MESSAGE.GR.CANCEL_CONFIRM_DETAILS;
        const gRNo = this.state.goodsReceiptNo;
        openMessageDialog({
            content: msg.replace(
                '%INSTANCE%',
                `${gRNo}`,
            ),
            buttons: [
                {
                    name: buttonConstant.BUTTON_CANCEL,
                    type: dialogConstant.button.FUNCTION,
                },
                {
                    name: buttonConstant.BUTTON_OK,
                    type: dialogConstant.button.FUNCTION,
                    action: () => this.props.navigation.navigate('GoodsReceiptList'),
                },
            ],
        });
    };

    confirmSubmit = () => {
        const { goodsReceiptNo } = this.state;

        showMessage(
            MESSAGE.GR.SUBMIT_CONFIRM_DETAILS.replace('%INSTANCE%', goodsReceiptNo),
            this.handleSubmit.bind(this, goodsReceiptNo),
            true,
        );
    };

    handleSubmit = (goodsReceiptNo) => {
        const { goodsReceiptId } = this.state;
        const successfullMsg = MESSAGE.GR.SUBMIT_GR_DETAILS_SUCCESSFULLY;

        const params = { goodsReceiptId: goodsReceiptId };

        reSubmitGoodsReceiptWithDetails(params).then(res => {
            let msg = [];
            if (res.message && res.message.messages && res.message.messages.length) {
                const msgSAPOject = res.message?.messages[0]?.errorSAPRestVO;
                if (isEmpty(msgSAPOject)) {
                    this.handleErrorMessage(res);
                } else {
                    res.message?.messages?.map(item => {
                        msg.push(
                            `-${item.errorSAPRestVO?.MESSAGE} ${item.errorSAPRestVO?.FIELD}`
                        );
                    });
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
                }
            } else {
                openMessageDialog({
                    content: successfullMsg,
                    buttons: [
                        {
                            name: buttonConstant.BUTTON_OK,
                            type: dialogConstant.button.FUNCTION,
                            action: () => this.props.navigation.navigate('GoodsReceiptList'),
                        },
                    ],
                });
            }
        }).catch((err) => {
            const msg = getErrorMessage(err);
            showMessage(msg, this.goToListPage.bind(this));
            return;
        });
    };

    goToListPage = () => {
        const { navigation } = this.props;
        const { navigate } = navigation;

        navigate('GoodsReceiptList');
    };

    isShowCancelBtn = () => {
        const { goodReceiptType, status, detailsData } = this.state;
        const { submittedTime } = detailsData;

        const convertedSubmittedDateTime = new Date(
            formatDateString(
                submittedTime,
                dateFormat.yyyymmddHHmmss,
                true
            )
        );
        const submittedMonth = convertedSubmittedDateTime.getMonth();

        const currentDateTime = new Date();
        const currentMonth = currentDateTime.getMonth();

        // Condition for display Cancel button
        return (goodReceiptType === GRConstant.goodsReceipTypeValue.branchPoTypeCode) && (status === GRConstant.statusValue.complete) && (submittedMonth === currentMonth);
    };

    isShowSubmitBtn = () => {
        const { status } = this.state;
        return status === GRConstant.statusValue.failed;
    };

    onNextStep = () => {
        this.setState({ labelTime: [...this.state.labelTime, this.state.curTime] });
    };

    renderLastStep = (fieldArr, temperatureOfItemsData, attachedImagesFieldArr) => {
        return (
            <View style={GRDetailsStyles.lastViewFieldsWrapper}>
                <View style={GRDetailsStyles.lastViewFieldsCtn}>
                    <View style={GRDetailsStyles.lastViewFieldsLeft}>
                        <Field
                            conditionalArray={fieldArr}
                            isPortTrait={false}
                        />
                    </View>
                    <View style={GRDetailsStyles.lastViewFieldsRight}>
                        <Text style={GRDetailsStyles.lastViewFieldsRightText1}>{temperatureOfItemsData.temperature1 || 0}</Text>
                        <Text style={GRDetailsStyles.lastViewFieldsRightText2}>{temperatureOfItemsData.temperature2 || 0}</Text>
                        <Text style={GRDetailsStyles.lastViewFieldsRightText2}>{temperatureOfItemsData.temperature3 || 0}</Text>
                    </View>
                </View>
                <View>
                    <Field
                        conditionalArray={attachedImagesFieldArr}
                    />
                </View>
            </View>
        );
    };

    renderChildrenItem = (data) => {
        const { isBranchPoType } = this.state;

        return [...data].map((item, index) => {
            return (
                <View style={GRDetailsStyles.viewItem} key={index}>
                    <View style={GRDetailsStyles.viewItemInfo}>
                        <Image style={GRDetailsStyles.image} source={noImage} />
                        <View style={GRDetailsStyles.viewInfo}>
                            <Text style={GRDetailsStyles.textFont}>Code:{item.sku}</Text>
                            <Text style={[GRDetailsStyles.textFont, GRDetailsStyles.description]}>
                                {item.description}
                            </Text>
                            <Text style={GRDetailsStyles.textFont}>Order Unit:{item.uom}</Text>
                        </View>
                        <View style={GRDetailsStyles.viewQty}>

                            <Text style={[GRDetailsStyles.textFont, !isBranchPoType ? GRDetailsStyles.textQty : GRDetailsStyles.textQtyOnly, GRDetailsStyles.textTitle]}>
                                {item.receivedQty}
                            </Text>
                        </View>
                        {!isBranchPoType && (
                            <Text style={[GRDetailsStyles.textBatchNo, GRDetailsStyles.textTitle]}>
                                {item.batchNo ? `<${item.batchNo}>` : '<Batch No.>'}
                            </Text>
                        )}
                    </View>

                    <View>
                        {!isBranchPoType && (<View style={GRDetailsStyles.overDeliveryArea}>
                            <View style={GRDetailsStyles.overDeliveryFieldLeft}>
                                <Field
                                    conditionalArray={deliveryTypeField(item)}
                                    onChange={e => this.onValueChange(e)}
                                    isPortTrait={false}
                                />
                            </View>
                            <View style={GRDetailsStyles.overDeliveryFieldRight}>
                                <Text style={GRDetailsStyles.overDeliveryFieldRightText}>{item.adjQty || 0}</Text>
                            </View>
                        </View>)}
                    </View>
                </View>
            );
        })
    };

    render() {
        const { goodsReceiptNo, lastViewFieldsArr, attachedImagesFieldArr, detailsData, detailsItemsData, submittedTimeArr, isBranchPoType, temperatureOfItemsData, attachedImagesData } = this.state;
        const attachedImageArr = attachedImagesFieldArr(attachedImagesData);
        const lastViewArr = lastViewFieldsArr(temperatureOfItemsData, isBranchPoType);

        const { navigation } = this.props;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header title={`Goods Receipt No: ${goodsReceiptNo}`} withoutDialog={true} />
                <DetailForm
                    configStep={this.state.configStep(
                        detailsData || {},
                        isBranchPoType,
                        !isEmpty(detailsItemsData) ? <View style={GRDetailsStyles.secondStepViewWrapper}>{this.renderChildrenItem(detailsItemsData)}</View> : null,
                        <View>{this.renderLastStep(lastViewArr, temperatureOfItemsData, attachedImageArr)}</View>
                    )}
                    navigation={navigation}
                    bottomActionNextBtnConfig={bottomActionNextBtnConfig}
                    stepLabelArr={submittedTimeArr}
                />
                <View style={GRDetailsStyles.actionArea}>
                    {this.isShowCancelBtn() && (<View style={GRDetailsStyles.actionChildArea}>
                        <Button
                            style={GRDetailsStyles.cancelBtn}
                            full
                            type="outline"
                            onPress={this.handleCancel}
                            disabled={true}
                        >
                            <Text>{'CANCEL'}</Text>
                        </Button>
                    </View>)}
                    {this.isShowSubmitBtn() && (<View style={GRDetailsStyles.actionChildArea}>
                        <Button
                            style={GRDetailsStyles.submitBtn}
                            full
                            type="outline"
                            onPress={this.confirmSubmit}
                        >
                            <Text style={GRDetailsStyles.submitTextBtn}>{'SUBMIT'}</Text>
                        </Button>
                    </View>)}
                </View>
            </SafeAreaView>
        );
    }
}

export default withTranslation()(GoodsReceiptDetail);