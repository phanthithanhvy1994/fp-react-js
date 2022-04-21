import React, {Component} from 'react';
import {Icon, Button} from 'native-base';
import {withNavigation, NavigationActions} from 'react-navigation';

class ButtonBack extends Component {
  render() {
    const {navigation} = this.props;

    return (
      <Button
        transparent
        onPress={() => navigation.dispatch(NavigationActions.back())}>
        <Icon style={{color: '#fff'}} name="ios-arrow-back" />
      </Button>
    );
  }
}

export default withNavigation(ButtonBack);
