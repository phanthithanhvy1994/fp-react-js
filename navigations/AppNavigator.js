import {createStackNavigator} from 'react-navigation-stack';

import AppTabs from './Tabs/AppTabs';

const RouteConfigs = {
  AppTabs: {
    screen: AppTabs,
  },
};
const StackNavigatorConfig = {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  },
};
const AppNavigator = createStackNavigator(RouteConfigs, StackNavigatorConfig);

export default AppNavigator;
