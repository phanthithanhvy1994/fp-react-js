import React from 'react';
import {AppState} from 'react-native';
import {StyleProvider} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import AppNavigator from './navigations/index';
import DeviceInfo from 'react-native-device-info';

import MessageDialog from './components/shared/dialog/MessageDialog';

import {
  asyncStorageConst,
  deviceInfo,
  NotificationType,
} from './constants/constants';

import variables from './styles/theme/variables/platform';
import getTheme from './styles/theme/components';

import {notificationService} from './services/notificationService';
import Spinner from './components/shared/spinner/Spinner';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    AsyncStorage.removeItem(asyncStorageConst.TOKEN);
    DeviceInfo.getManufacturer().then(manufacturer => {
      const isHoneyWell =
        manufacturer === deviceInfo.manufacturer.HONEYWELL ? 'true' : 'false';
      AsyncStorage.setItem(asyncStorageConst.isHoneyWell, isHoneyWell);
    });
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    if (this.state.appState === 'active' && nextAppState === 'background') {
      notificationService.notify(NotificationType.IS_BACKGROUNDING);
    }
    this.setState({appState: nextAppState});
  };

  getCurrentRouteName = navigationState => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
      return this.getCurrentRouteName(route);
    }
    return route.routeName;
  };

  render() {
    return (
      <React.Fragment>
        <StyleProvider style={getTheme(variables)}>
          <React.Fragment>
            <AppNavigator />
            <MessageDialog />
            <Spinner />
          </React.Fragment>
        </StyleProvider>
      </React.Fragment>
    );
  }
}
