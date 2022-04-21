import {createStackNavigator} from 'react-navigation-stack';

import LoginScreen from '../components/login/Login';
import SplashScreen from '../components/splash/Splash';

const AuthNavigatorConfig = {
  initialRouteName: 'Splash',
  header: null,
  headerMode: 'none',
};

const RouteConfigs = {
  Splash: SplashScreen,
  Login: LoginScreen,
};

const AuthNavigator = createStackNavigator(RouteConfigs, AuthNavigatorConfig);

export default AuthNavigator;
