import {StyleSheet} from 'react-native';
import {defaultColor, defaultSize} from '../../styles/theme/variables/platform';

export default StyleSheet.create({
  container: {flex: 1, padding: 10},
  view: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: 103,
    height: 103,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: `${defaultColor.white}`,
    shadowColor: `${defaultColor.gray}`,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 4,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  text: {
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
    color: defaultColor.text,
  },

  iconSize: defaultSize.icon,
});
