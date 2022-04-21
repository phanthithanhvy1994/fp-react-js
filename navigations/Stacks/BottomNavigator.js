import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {defaultSize} from '../../styles/theme/variables/platform';
import {createStackNavigator} from 'react-navigation-stack';

// Others
import HomeScreen from '../../components/home/Home';
import MenuScreen from '../../components/menu/Menu';
import Header from '../../components/core/HeaderComponent';
// Stock
import GoodsReceiptList from '../../components/goods-receipt/list/GoodsReceiptList';
import AssetTransferList from '../../components/asset-transfer/list/AssetTransferList';

import {TabNavigatorConfig} from './bottomNavigator.config';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../../selection.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);

// Utils
import I18n from '../../utils/i18n';

const BottomNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: createStackNavigator(
        {HomeScreen},
        {
          defaultNavigationOptions: {
            header: (
              <Header title={I18n.t('Home Screen')} isHomeScreen={true} />
            ),
          },
          navigationOptions: {
            tabBarIcon: ({tintColor}) => (
              <Icon
                name="icon-home"
                size={defaultSize.icon}
                color={tintColor}
              />
            ),
            tabBarLabel: I18n.t('Home'),
          },
        },
      ),
    },
    GoodsReceipt: {
      screen: createStackNavigator(
        {GoodsReceiptList},
        {
          defaultNavigationOptions: {
            header: (
              <Header
                title={I18n.t('Goods Receipt List')}
                isMainScreen={true}
                isAddScreen={true}
                screenName="GoodsReceiptAddEdit"
              />
            ),
          },
          navigationOptions: {
            header: null,
            tabBarIcon: ({tintColor}) => (
              <Icon
                name="icon-receipt"
                size={defaultSize.icon}
                color={tintColor}
              />
            ),
            tabBarLabel: I18n.t('Goods Receipt'),
          },
        },
      ),
    },

    AssetTransfer: {
      screen: createStackNavigator(
        {AssetTransferList},
        {
          defaultNavigationOptions: {
            header: (
              <Header
                title={I18n.t('Asset Transfer List')}
                isMainScreen={true}
                isAddScreen={true}
                screenName="AssetTransferAddEdit"
              />
            ),
          },
          navigationOptions: {
            header: null,
            tabBarIcon: ({tintColor}) => (
              <Icon
                name="icon-receipt"
                size={defaultSize.icon}
                color={tintColor}
              />
            ),
            tabBarLabel: I18n.t('Asset Transfer'),
          },
        },
      ),
    },

    CashDeposit: {
      screen: createStackNavigator(
        {MenuScreen},
        {
          defaultNavigationOptions: {
            header: (
              <Header title={I18n.t('Cash Deposit')} isMainScreen={true} />
            ),
          },
          navigationOptions: {
            header: null,
            tabBarIcon: ({tintColor}) => (
              <Icon
                name="icon-card"
                size={defaultSize.icon}
                color={tintColor}
              />
            ),
            tabBarLabel: I18n.t('Cash Deposit'),
          },
        },
      ),
    },
  },
  TabNavigatorConfig,
);

export default BottomNavigator;
