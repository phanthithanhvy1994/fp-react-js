import { StyleSheet } from 'react-native';
import { defaultColor } from '../../../styles/theme/variables/platform';

export const filterFieldStyle = StyleSheet.create({
  labelContainer: {
    fontSize: 12,
  },
});

export const styles = StyleSheet.create({
  viewItem: {
    backgroundColor: defaultColor.extraLightGray,
    marginLeft: 8,
    marginRight: 8,
    marginTop: -8,
  },
  viewItemInfo: {
    marginLeft: 24,
    marginRight: 24,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 13,
  },
  itemInfo: {
    width: '70%',
  },
  image: {
    marginRight: 8,
  },
  viewQty: {
    position: 'absolute',
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  description: {
    maxWidth: '80%',
  },
});
