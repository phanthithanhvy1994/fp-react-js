import React from 'react';
import {SafeAreaView} from 'react-native';
import DetailForm from '../../shared/detail-form/DetailForm';
import Header from '../../core/HeaderComponent';
import {configStep, itemsView} from './AssetReceiptDetail.config';
import {
  getAssetReceiptDetailById,
} from '../../../actions/asset-receipt-action';
import {View} from 'native-base';
import {styles} from './AssetReceiptDetail.style';

class AssetReceiptDetail extends React.Component {
  _isMounted = true;

  constructor(props) {
    super(props);
    this.state = {
      assetReceiptId: '',
      configStep,
      itemsView,
      detailData: {},
      isFromAssetRequestType: false,
      isAssetLendingType: true,
      isSubmitted: true,
    };
  }

  loadAssetReceiptData = () => {
    getAssetReceiptDetailById().then(res => {
      if (res.data) {
        this.setState({
          detailData: res.data,
        });
      }
    });
  };

  onFieldChange = event => {
    const {value, name} = event.target;
    if (!this._isMounted) {
      return;
    }
    this.setState({
      detailData: {
        ...this.state.detailData,
        [name]: value,
      },
    });
  };

  renderSecondStep = detailData => {
    const {itemsView} = this.state;
    const assetReceiptItemsList = detailData?.assetReceiptItemsList;

    const itemView = itemsView();
    const {items} = itemView;

    return [...assetReceiptItemsList]?.map((assetReceiptItem, index) => (
      <View style={styles.itemInfoCtn} key={index}>
        {items && items.view(assetReceiptItem, index)}
      </View>
    ));
  };

  componentDidMount() {
    if (!this._isMounted) {
      return;
    } else {
      const {navigation} = this.props;
      const assetReceiptId = navigation.state.params.assetReceiptId;

      this.loadAssetReceiptData();
      // Will remove when integrate with API

      this.setState({assetReceiptId});
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {navigation} = this.props;
    const {
      assetReceiptId,
      isFromAssetRequestType,
      isAssetLendingType,
      detailData,
    } = this.state;

    return (
      <SafeAreaView style={{flex: 1}}>
        <Header
          title={`Asset Receipt No: ${assetReceiptId}`}
          withoutDialog={true}
        />
        <DetailForm
          configStep={this.state.configStep(
            detailData || {},
            {},
            isFromAssetRequestType,
            isAssetLendingType,
            detailData?.assetReceiptItemsList && (
              <View>{this.renderSecondStep(detailData)}</View>
            ),
          )}
          isShowHistoryTimeLine={true}
          navigation={navigation}
          onFieldChange={this.onFieldChange}
        />
      </SafeAreaView>
    );
  }
}

export default AssetReceiptDetail;
