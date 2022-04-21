import React from 'react';
import { SafeAreaView } from 'react-native';
import DetailForm from '../../shared/detail-form/DetailForm';
import { configStep, bottomActionNextBtnConfig } from './AssetTransferTrackingDetails.config';
import {
    getAssetTrackingDetail
} from '../../../actions/asset-transfer-tracking-action';

class AssetTransferTrackingDetails extends React.Component {
    _isMounted = true;
    constructor(props) {
        super(props);
        this.state = {
            assetTransferNo: '',
            configStep,
            detailData: {},
            historyTimeLineData: [],
            lstAssetTransferNo: []
        };
    }

    /**
     * Load data by Id
     * @param {*} assetTrackingId
     */
    loadATData = (assetTrackingId) => {
        getAssetTrackingDetail({ id: assetTrackingId }).then((res) => {
            if (res.data) {
                this.setState({
                    detailData: res.data,
                    lstAssetTransferNo: res.data.assetTrackingDetailVOs?.map(el => el.assetTransferNo),
                });
            }
        });
    };

    /**
     * componentDidMount
     * @returns 
     */
    componentDidMount() {
        if (!this._isMounted) {
            return;
        } else {
            const { navigation } = this.props;
            const assetTrackingId = navigation.state && navigation.state.params.assetTrackingId;
            this.loadATData(assetTrackingId);

            // this.setState({ historyTimeLineData: historyTimeLineData, assetTransferNo })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { navigation } = this.props;
        const { detailData, lstAssetTransferNo } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {/* <Header title={`Asset Transfer No:123 `} /> */}
                <DetailForm 
                    configStep={this.state.configStep(
                        detailData || {},
                        lstAssetTransferNo
                    )}
                    navigation={navigation}
                    bottomActionNextBtnConfig={bottomActionNextBtnConfig}
                />
            </SafeAreaView>
        );
    }
}

export default AssetTransferTrackingDetails;
