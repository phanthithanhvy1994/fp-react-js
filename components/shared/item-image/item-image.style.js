import { StyleSheet } from 'react-native';
import { defaultColor } from '../../../styles/theme/variables/platform';

export const styles = StyleSheet.create({
  viewItem: {
    backgroundColor: defaultColor.extraLightGray,
    marginLeft: 8,
    marginRight: 8,
    marginTop: -8,
  },
  viewInfo: {
    flex: 1,
    alignContent: 'flex-start',
  },
  viewItemInfo: {
    // marginLeft: 16,
    // marginRight: 16,
    marginTop: 8,
    // marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 13,
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