import React from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import {styles} from './form.style';

export default class FormValidatorWrapper extends React.Component {
  render() {
    const {error} = this.props;
    return (
      <>
        {this.props.children}
        {error && (
          <View style={styles.view}>
            <Text style={styles.text}>{error}</Text>
          </View>
        )}
      </>
    );
  }
}

FormValidatorWrapper.propTypes = {
  children: PropTypes.any,
  error: PropTypes.any,
};
