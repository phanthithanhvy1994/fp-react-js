import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import DetailForm from '../../shared/detail-form/DetailForm';
import Header from '../../core/HeaderComponent';
import { configStep, bottomActionNextBtnConfig, itemsView } from './asset-transfer-details.config';
import {
    getAssetTransferDetailsById,
    cancelAssetTransfer,
    getASTType,
} from '../../../actions/asset-transfer-action';
import { getAssetLocation, getBranchByUser } from '../../../actions/common-action';

import { formatComboBox, formatDropdownList } from '../../../utils/format-util';
import { showMessage, getErrorMessage } from '../../../utils/message-util';
import { MESSAGE } from '../../../constants/message';
import { Button } from 'native-base';
import { styles } from './asset-transfer-details.style';
import { ATConstant } from '../../../constants/constants';

class AssetTransferDetails extends React.Component {
    _isMounted = true;

    constructor(props) {
        super(props);
        this.state = {
            assetTransferNo: '',
            assetTransferId: '',
            configStep,
            itemsView,
            detailData: {},
            arNoArr: [],
            historyTimeLineData: [],
            isFromAssetRequestType: false,
            isAssetLendingType: false,
            isSubmitted: true,
            assetTransferType: '',
            assetTransferStatus: '',
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

    loadAssetLocation = () => {
        return new Promise(resolve => {
            getAssetLocation().then(res => {
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

    convertHistoryTimeLineData = data => {
        let newTimeLineData = [];

        if (data && data.length) {
            newTimeLineData = data.map((item) => ({
                title: item.updateDate,
                customContent: `<${item.userCode}> + <${item.userName}>\n<${item.assetTrackingNo}>\n<${item.assetTrackingStatus}>`
            }));
        }

        return newTimeLineData;
    }

    convertDataForSndStep = data => {
        let newData = {};

        if (data) {
            newData.listARNo = data.assetTransferDetailTbls?.map(item => {
                const categoryInfo = item.assetRequestMaster?.map(el => ({
                    assetRequestMasterName: el.assetRequestMasterName,
                    quantity: el.quantity,
                    itemInfo: item.assetTransferRequestDetailVOS.filter(x => x.assetRequestDetailId === el.assetRequestDetailId)
                }));

                return ({
                    assetRequestNo: item.assetRequestNo,
                    categoryInfo: { ...categoryInfo[0] },
                })
            })
        }

        return newData;
    };

    getArNoArr = data => {
        let newArNoArr = [];

        newArNoArr = data?.assetTransferDetailTbls?.map(el => el.assetRequestNo) || [];

        return newArNoArr;
    };

    isHiddenLocationField = (assetClass) => {
        let isHidden = false;
        const { assetTransferType } = this.state;

        // 1. When Type = "Return-Permanent", "Return-Strip Down"
        // - If Asset Class is Non-Utensil: display data from DB
        // - If If Asset Class is Utensil: hide this field
        // 2. When Type = "Change Location", "Asset Lending", "Repair": Display data from DB
        // 3. When Type = "Asset Lending Return","Branch Opening": hide this field.

        if (
            assetTransferType === ATConstant.typeValue.returnPermanent ||
            assetTransferType === ATConstant.typeValue.returnStripDown
        ) {
            if (assetClass === ATConstant.assetCategory.Utensil) {
                isHidden = true;
            }
        }

        if (
            assetTransferType === ATConstant.typeValue.assetLendingReturn ||
            assetTransferType === ATConstant.typeValue.branchOpening
        ) {
            isHidden = true;
        }

        if (
            assetTransferType === ATConstant.typeValue.location ||
            assetTransferType === ATConstant.typeValue.assetLending ||
            assetTransferType === ATConstant.typeValue.repair
        ) {
            isHidden = false;
        }

        return isHidden;
    };

    loadATData = (assetTransferId) => {
        getAssetTransferDetailsById(assetTransferId).then((res) => {
            if (res.data) {
                const convertedDataForSndStep = this.convertDataForSndStep(res.data);
                const arNoArr = this.getArNoArr(res.data);
                const listARNo = convertedDataForSndStep.listARNo;
                const newDetailData = {
                    ...res.data,
                    listARNo: listARNo
                };

                const historyTimeLineData = this.convertHistoryTimeLineData(res.data?.historyVOs);

                this.setState({
                    detailData: newDetailData,
                    historyTimeLineData,
                    arNoArr
                });
            }
        }).catch((err) => {
            const msg = getErrorMessage(err);
            showMessage(msg);
        });
    };

    onFieldChange = (event) => {
        const { value, name } = event.target;
        if (!this._isMounted) {
            return;
        }
        this.setState({
            detailData: {
                ...this.state.detailData,
                [name]: value
            }
        });
    }

    isShowCancelBtn = () => {
        const { assetTransferStatus } = this.state;

        // Condition for display Cancel button
        return (assetTransferStatus === ATConstant.statusValue.submitted || assetTransferStatus === ATConstant.statusName.submitted);
    };

    // handle for Cancel
    handleCancelBtn = () => {
        this.confirmCancel();
    };

    confirmCancel = () => {
        const { assetTransferNo, assetTransferId } = this.state;

        showMessage(
            MESSAGE.AST.CONFIRM_CANCEL_AS_TRANSFER.replace('{{astNo}}', assetTransferNo, assetTransferId),
            this.handleCancel.bind(this, assetTransferNo, assetTransferId),
            true,
        );
    };

    handleCancel = (assetTransferNo, assetTransferId) => {
        cancelAssetTransfer(assetTransferId).then((res) => {
            if (res.message) {
                showMessage(getErrorMessage(res), this.goToList.bind(this));
            } else {
                showMessage(
                    MESSAGE.AST.CANCEL_ASSET_TRANSFER_SUCCESSFULLY.replace('{{astNo}}', assetTransferNo),
                    this.goToList.bind(this)
                );
            }
        }).catch((err) => {
            if (typeof err === 'string') {
                showMessage(err);
                return;
            }

            const msg = getErrorMessage(err);
            showMessage(msg);
        });
    };

    goToList = () => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        navigate('AssetTransferList');
    };

    renderSecondStep = (detailData) => {
        const { itemsView, listComboboxData, isFromAssetRequestType } = this.state;
        const listARNo = detailData?.listARNo;

        const itemView = itemsView();
        const items = itemView.items;
        const beforeItemView = itemView.before;
        const afterItemView = itemView.after;

        return [...listARNo]?.map((arNoItem, parentIndex) => {
            return (
                <View style={isFromAssetRequestType && styles.assetTransferNoCtn} key={parentIndex}>
                    {isFromAssetRequestType && (
                        <Text style={styles.assetTransferNo}>
                            {`Asset Request No.: ${arNoItem.assetRequestNo}`}
                        </Text>
                    )}
                    <View>
                        <View>
                            {isFromAssetRequestType && (
                                <View style={styles.viewItemInfo}>
                                    <Text style={styles.assetTransferCatg}>{arNoItem?.categoryInfo?.assetRequestMasterName}</Text>

                                    <View style={styles.viewQty}>
                                        <Text style={styles.textQty}>
                                            {arNoItem?.categoryInfo?.quantity}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            {arNoItem?.categoryInfo?.itemInfo?.map((item, subChildIndex) => (
                                <View style={styles.itemInfoCtn} key={subChildIndex}>
                                    {beforeItemView && beforeItemView.view(item, subChildIndex)}
                                    {items && items.view(item, subChildIndex)}
                                    {!this.isHiddenLocationField(item.assetCategory) && afterItemView && afterItemView.view(item, listComboboxData, subChildIndex)}
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            )
        });
    };

    componentDidMount() {
        const { navigation } = this.props;
        const assetTransferNo = navigation.state.params.assetTransferNo;
        const assetTransferId = navigation.state.params.assetTransferId;
        const detailsInfo = navigation.state.params.detailsInfo;
        const assetTransferType = detailsInfo && detailsInfo.assetTransferType;
        const isFromAssetRequestType = assetTransferType === ATConstant.typeValue.fromAR;
        const isAssetLendingType = detailsInfo && detailsInfo.assetTransferType === ATConstant.typeValue.assetLending;
        const assetTransferStatus = detailsInfo.status;

        if (!this._isMounted) {
            return;
        }
        Promise.all([
            this.loadType(),
            this.loadAssetLocation(),
            this.loadBranchByUser(),
            // this.loadAssetTransferTimeLine(),
        ]).then(values => {
            if (!this._isMounted) {
                return;
            }

            const listComboboxData = {
                type: formatComboBox(values[0].data),
                location: formatComboBox(values[1].data, 'assetLocationCode', 'assetLocationName'),
                branch: formatDropdownList(values[2].data, 'branchCode', 'branchName'),
            };

            this.loadATData(assetTransferId);

            this.setState({
                assetTransferNo,
                assetTransferId,
                assetTransferType,
                isFromAssetRequestType,
                isAssetLendingType,
                assetTransferStatus,
                listComboboxData
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { navigation } = this.props;
        const { assetTransferNo, isFromAssetRequestType, isAssetLendingType, detailData, listComboboxData, arNoArr } = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header title={`Asset Transfer No: ${assetTransferNo}`} withoutDialog={true} />
                <DetailForm
                    configStep={this.state.configStep(
                        detailData || {},
                        listComboboxData,
                        arNoArr,
                        isFromAssetRequestType,
                        isAssetLendingType,
                        detailData?.listARNo && <View>{this.renderSecondStep(detailData)}</View>
                    )}
                    isShowHistoryTimeLine={true}
                    historyTimeLineData={this.state.historyTimeLineData}
                    navigation={navigation}
                    onFieldChange={this.onFieldChange}
                    bottomActionNextBtnConfig={bottomActionNextBtnConfig}
                // handleForFullWidthButton={this.handleCancelBtn}
                />
                <View style={styles.actionArea}>
                    {this.isShowCancelBtn() && (
                        <View style={styles.actionChildArea}>
                            <Button
                                style={styles.cancelBtn}
                                full
                                type="outline"
                                onPress={this.handleCancelBtn}
                            >
                                <Text>{'CANCEL'}</Text>
                            </Button>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

export default AssetTransferDetails;
