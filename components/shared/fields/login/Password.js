import React, {Component} from 'react';
import {Input, Item, Icon, Button} from 'native-base';

import {withTranslation} from 'react-i18next';
import {passwordStyles} from './Password.style';
import icoMoonConfig from '../../../../selection.json';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';

const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);
class Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPassword: true,
    };
  }

  renderAuthField = () => {
    // Get props
    const {field, onChange, onSubmitEditing, t} = this.props;
    const {isShowPassword} = this.state;
    // Get field
    const {placeHolderText, value, fieldName} = field;

    return (
      <Item style={passwordStyles.fieldContainer}>
        <Item style={passwordStyles.fieldItem} regular>
          <IcoMoon
            style={passwordStyles.iconPassword}
            size={passwordStyles.iconSize.size}
            name="icon-lock"
          />
          <Input
            placeholder={t(placeHolderText)}
            value={value || ''}
            onChangeText={text =>
              onChange({target: {value: text, name: fieldName}})
            }
            secureTextEntry={isShowPassword}
            style={passwordStyles.input}
            placeholderTextColor={passwordStyles.placeholder.color}
            // [HONDAIPB-CR] - 25/06/2020 - Honda IT wants pressing Enter in the keyboard, the app should starts logging in.
            // Add new props function onSubmitEditing
            onSubmitEditing={onSubmitEditing}
          />
          <Button
            transparent
            onPressIn={() => this.setState({isShowPassword: false})}
            onPressOut={() => this.setState({isShowPassword: true})}>
            <Icon name="md-eye" style={passwordStyles.iconShowPassword} />
          </Button>
        </Item>
      </Item>
    );
  };

  render() {
    return <>{this.renderAuthField()}</>;
  }
}

export default withTranslation()(Password);
