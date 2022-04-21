import React from 'react';

import {View} from 'react-native';
import {splashImg, splashTitle} from '../../assets/images';
import {WithLocalSvg} from 'react-native-svg';

import splashStyles from './Splash.style';

class SplashScreen extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate('Login');
    }, 2000);
  }

  render() {
    return (
      <View style={splashStyles.container}>
        <WithLocalSvg width="100%" asset={splashImg} />
        <WithLocalSvg
          width="100%"
          style={splashStyles.title}
          asset={splashTitle}
        />
      </View>
    );
  }
}

export default SplashScreen;
