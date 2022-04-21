import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
// Others
import HomeScreen from '../../components/home/Home';

import Header from '../../components/core/HeaderComponent';
import CodeScan from '../../components/shared/code-scan/CodeScan';
import Menu from '../../components/menu/Menu';
import GoodsReceiptAddEdit from '../../components/goods-receipt/add-edit/GoodsReceiptAddEdit';
import GoodsReceiptDetail from '../../components/goods-receipt/detail/GoodsReceiptDetail';
// Stock
import GoodsReceiptList from '../../components/goods-receipt/list/GoodsReceiptList';
import AssetTransferList from '../../components/asset-transfer/list/AssetTransferList';
import AssetTransferDetails from '../../components/asset-transfer/detail/asset-transfer-details';
import AssetTransferAddEdit from '../../components/asset-transfer/add-edit/AssetTransferAddEdit';
//Transfer tracking
import AssetTransferTrackingList from '../../components/asset-transfer-tracking/list/AssetTransferTrackingList';
import AssetTransferTrackingDetails from '../../components/asset-transfer-tracking/detail/AssetTransferTrackingDetails';
import AssetTransferTrackingAddEdit from '../../components/asset-transfer-tracking/add-edit/AssetTransferTrackingAddEdit';
// Asset Receipt
import AssetReceiptList from '../../components/asset-receipt/list/AssetReceiptList'
import AssetReceiptDetail from '../../components/asset-receipt/detail/AssetReceiptDetail'

// Utils
import I18n from '../../utils/i18n';

const AppTabs = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: <Header title={I18n.t('Home')} isHomeScreen={true} />,
      tabBarLabel: I18n.t('Home'),
    },
  },
  GoodsReceiptList: {
    screen: GoodsReceiptList,
    navigationOptions: {
      header: (
        <Header
          title={I18n.t('Goods Receipt List')}
          isMainScreen={true}
          isAddScreen={true}
          screenName="GoodsReceiptAddEdit"
        />
      ),
      tabBarLabel: I18n.t('Goods Receipt List'),
    },
  },
  AssetTransferList: {
    screen: AssetTransferList,
    navigationOptions: {
      header: (
        <Header
          title={I18n.t('Asset Transfer List')}
          isMainScreen={true}
          isAddScreen={true}
          screenName="AssetTransferAddEdit"
        />
      ),
      tabBarLabel: I18n.t('Asset Transfer List'),
    },
  },
  AssetTransferDetailScreen: {
    screen: AssetTransferDetails,
    navigationOptions: {
      header: null,
    },
  },
  AssetTransferTrackingList: {
    screen: AssetTransferTrackingList,
    navigationOptions: {
      header: (
        <Header
          title={I18n.t('Asset Transfer Tracking List')}
          isCalendar={true}
          isHomeScreen={true}
          isAddScreen={true}
          screenName="AssetTransferTrackingAddEdit"
        />
      ),
      tabBarLabel: I18n.t('Asset Transfer Tracking List'),
    },
  },

  AssetTransferTrackingDetails: {
    screen: AssetTransferTrackingDetails,
    navigationOptions: { 
      header: <Header title={I18n.t('View Asset Transfer Tracking')} />,
      tabBarLabel: I18n.t('View Asset Transfer Tracking'),
    },
  },

  AssetTransferTrackingAddEdit: {
    screen: AssetTransferTrackingAddEdit,
    navigationOptions: {
      header: (data) => {
        const isEditPage = data.scene.route && data.scene.route.params && data.scene.route.params.isEditPage;
        return <Header title={I18n.t(`${isEditPage ? 'Edit' : 'Add'} Asset Transfer Tracking`)} isShowCustomBtnHeader= {true}/>;
      }
    },
  },

  AssetReceiptList: {
    screen: AssetReceiptList,
    navigationOptions: {
      header: (
        <Header
          title={I18n.t('Asset Receipt List')}
          isMainScreen={true}
          isAddScreen={true}
          screenName="AssetReceiptAddEdit"
        />
      ),
      tabBarLabel: I18n.t('Asset Receipt List'),
    },
  },
  AssetReceiptDetailScreen: {
    screen: AssetReceiptDetail,
    navigationOptions: {
      header: null,
    },
  },
  GoodsReceiptDetailScreen: {
    screen: GoodsReceiptDetail,
    navigationOptions: {
      header: null,
    },
  },
  CodeScan: {
    screen: CodeScan,
    navigationOptions: {
      header: <Header title={I18n.t('Code Scan')} withoutDialog={true} />,
      tabBarLabel: I18n.t('Code Scan'),
    },
  },
  GoodsReceiptAddEdit: {
    screen: GoodsReceiptAddEdit,
    navigationOptions: {
      header: null,
      tabBarLabel: I18n.t('Create Goods Receipt'),
    },
  },
  AssetTransferAddEdit: {
    screen: AssetTransferAddEdit,
    navigationOptions: {
      header: (data) => {
        const params = (data.scene.route && data.scene.route.params) || {};
        const isEditPage = params.isEditPage;
        const title = isEditPage ? `Asset Transfer No ${params.assetTransferNoString}` : 'Add Asset Transfer';
        return <Header title={I18n.t(`${title}`)} isShowCustomBtnHeader= {true}/>;
      }
    },
  },
  Menu: {
    screen: Menu,
    navigationOptions: {
      header: <Header title={I18n.t('Menu')} isMenuScreen={true} />,
      tabBarLabel: I18n.t('Menu'),
    },
  },
});

export default AppTabs;
