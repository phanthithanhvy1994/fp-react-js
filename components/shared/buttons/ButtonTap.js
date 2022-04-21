import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import {TouchableOpacity} from 'react-native';

class ButtonTap extends Component {
  render() {
    const {navigation, path, data, onGoBack, ...rest} = this.props;

    return (
      <TouchableOpacity
        {...rest}
        onPress={() =>
          path &&
          navigation.navigate(path, {
            data: data,
            onGoBack: () => typeof onGoBack === 'function' && onGoBack(),
          })
        }>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

export default withNavigation(ButtonTap);
