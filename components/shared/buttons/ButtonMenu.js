import React, {Component} from 'react';
import {Icon, Button} from 'native-base';
import {withNavigation} from 'react-navigation';

class ButtonMenu extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <Button transparent onPress={() => navigation.navigate('Menu')}>
        <Icon style={{color: '#fff'}} name="ios-menu" />
      </Button>
    );
  }
}

export default withNavigation(ButtonMenu);
