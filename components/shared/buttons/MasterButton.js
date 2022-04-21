import React from 'react';
import PropTypes from 'prop-types';

import {withTranslation} from 'react-i18next';

import {Button} from 'react-native-elements';
import {Icon} from 'native-base';
import {buttonConstant} from '../../../constants/constants';
import {defaultColor} from '../../../styles/theme/variables/platform';
import {masterButtonStyles} from './button.style';

class MasterButton extends React.Component {
  render() {
    const {
      type,
      name,
      handleClick, // Event click
      title,
      icon,
      iconColor,
      buttonStyle,
      titleStyle,
      containerStyle,
      t,
    } = this.props;
    const getButton = nameButton => {
      switch (nameButton) {
        case buttonConstant.BUTTON_ADD:
          return (
            <Button
              icon={
                icon ? (
                  icon
                ) : (
                  <Icon name="plus" style={masterButtonStyles.iconColor} />
                )
              }
              title={t('Add')}
              iconLeft
              containerStyle={containerStyle ? containerStyle : undefined}
              buttonStyle={masterButtonStyles.buttonSecondaryStyle}
              titleStyle={masterButtonStyles.titleStyle}
              onPress={handleClick}
            />
          );
        case buttonConstant.BUTTON_OK:
          return (
            <Button
              icon={
                icon ? (
                  icon
                ) : (
                  <Icon
                    name="md-checkmark"
                    style={masterButtonStyles.iconColor}
                  />
                )
              }
              title={t('OK')}
              iconLeft
              containerStyle={containerStyle ? containerStyle : undefined}
              buttonStyle={masterButtonStyles.buttonPrimaryStyle}
              titleStyle={masterButtonStyles.titleStyle}
              onPress={handleClick}
            />
          );
        case buttonConstant.BUTTON_SEARCH:
          return (
            <Button
              icon={icon}
              title={t('Search')}
              iconLeft
              containerStyle={containerStyle ? containerStyle : undefined}
              buttonStyle={masterButtonStyles.buttonPrimaryStyle}
              titleStyle={masterButtonStyles.titleStyle}
              onPress={handleClick}
            />
          );
        case buttonConstant.BUTTON_RESET:
          return (
            <Button
              icon={icon}
              title={t('Reset')}
              iconLeft
              containerStyle={containerStyle ? containerStyle : undefined}
              buttonStyle={masterButtonStyles.buttonClearStyle}
              titleStyle={masterButtonStyles.titleOutLineStyle}
              onPress={handleClick}
            />
          );
        case buttonConstant.BUTTON_CANCEL:
          return (
            <Button
              icon={
                icon ? (
                  icon
                ) : (
                  <Icon name="md-close" style={{color: defaultColor.text}} />
                )
              }
              title={t('Cancel')}
              iconLeft
              containerStyle={containerStyle ? containerStyle : undefined}
              buttonStyle={masterButtonStyles.buttonCancelStyle}
              titleStyle={masterButtonStyles.titleOutLineStyle}
              onPress={handleClick}
            />
          );
        case buttonConstant.BUTTON_FILTER:
          return (
            <Button
              icon={
                <Icon name="ios-funnel" style={{color: defaultColor.white}} />
              }
              title={t('Filter')}
              iconLeft
              containerStyle={containerStyle ? containerStyle : undefined}
              buttonStyle={masterButtonStyles.buttonSecondaryStyle}
              titleStyle={
                titleStyle ? titleStyle : masterButtonStyles.titleStyle
              }
              onPress={handleClick}
            />
          );
        default:
          return (
            <Button
              icon={
                icon ? (
                  <Icon
                    name={icon}
                    style={[
                      iconColor ? iconColor : masterButtonStyles.iconColor,
                    ]}
                  />
                ) : null
              }
              title={title ? t(`${title}`) : ''}
              iconLeft
              containerStyle={containerStyle ? containerStyle : undefined}
              buttonStyle={[buttonStyle ? buttonStyle : undefined]}
              titleStyle={
                titleStyle ? titleStyle : masterButtonStyles.titleStyle
              }
              onPress={handleClick}
              type={type ? type : 'solid'} // "outline" or "clear" or "solid"
            />
          );
      }
    };
    return <>{getButton(name)}</>;
  }
}

Button.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  icon: PropTypes.object,
  type: PropTypes.string,
  name: PropTypes.string,
  buttonStyle: PropTypes.any,
  titleStyle: PropTypes.object,
  containerStyle: PropTypes.object,
};

export default withTranslation()(MasterButton);
