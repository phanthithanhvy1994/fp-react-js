import React from 'react';
import {Text, View, Icon, Button} from 'native-base';
import map from 'lodash/map';
import {Dimensions} from 'react-native';

import {actionButtons} from './ActionButtons.config';
import {withTranslation} from 'react-i18next';
import ActionButtonsStyles from './ActionButtons.style';

import {ScreenSizeDevice} from '../../../constants/constants';

function ActionButtons(props) {
  const {isPortTrait, onPress, t} = props;
  const screenHeight = Dimensions.get('window').height;
  let screenDevice = false;
  if (screenHeight < ScreenSizeDevice.EDA61K) {
    screenDevice = true;
  }
  return (
    <View
      style={[
        ActionButtonsStyles.container,
        isPortTrait ? ActionButtonsStyles.containerPortrait : '',
      ]}>
      {map(actionButtons, (item, index) => (
        <Button
          style={[
            ActionButtonsStyles.button,
            isPortTrait ? ActionButtonsStyles.button.buttonPortrait : '',
          ]}
          key={index}
          onPress={() => onPress(item.actionName)}>
          <Icon
            name={item.icon}
            style={ActionButtonsStyles.container.icon}
            size={20}
          />
          <Text
            uppercase={false}
            style={[
              screenDevice
                ? ActionButtonsStyles.container.text
                : ActionButtonsStyles.container.textLandscape,
            ]}>
            {t(`${item.label}`)}
          </Text>
        </Button>
      ))}
    </View>
  );
}
export default withTranslation()(ActionButtons);
