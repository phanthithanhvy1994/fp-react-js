import {StyleSheet} from 'react-native';
import {defaultColor} from '../../../styles/theme/variables/platform';

export const masterButtonStyles = StyleSheet.create({
  buttonStyle: {
    height: 36,
    width: 86,
    marginRight: 8,
    justifyContent: 'space-evenly',
  },
  iconColor: {
    color: defaultColor.white,
    fontSize: 20,
  },

  iconClearStyle: {
    color: defaultColor.outline,
    fontSize: 20,
  },
  buttonPrimaryStyle: {
    height: 36,
    width: 94,
    backgroundColor: defaultColor.primary,
    justifyContent: 'space-evenly',
    borderRadius: 0,
  },
  buttonSecondaryStyle: {
    height: 36,
    width: 86,
    backgroundColor: defaultColor.secondary,
  },
  buttonCancelStyle: {
    height: 36,
    backgroundColor: defaultColor.white,
    borderColor: defaultColor.text,
    width: 86,
    borderRadius: 2,
    borderWidth: 1,
    marginLeft: 7,
    marginRight: 7,
  },
  buttonClearStyle: {
    height: 36,
    backgroundColor: defaultColor.white,
    borderColor: defaultColor.white,
    borderRadius: 2,
    borderWidth: 1,
    marginRight: 7,
    width: 94,
  },
  titleStyle: {fontSize: 14},
  titleOutLineStyle: {fontSize: 14, marginLeft: 6, color: defaultColor.outline},
});
