import {StyleSheet} from 'react-native';
import {defaultColor} from '../../../styles/theme/variables/platform';

export const styles = StyleSheet.create({
  view: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '100',
    color: defaultColor.danger,
  },
});
