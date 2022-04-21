import {StyleSheet} from 'react-native';
import {defaultColor} from '../styles/theme/variables/platform';

export const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: defaultColor.white,
  },
  headerStatus: {
    color: 'blue',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexRowPopup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexColumnPopup: {
    flexDirection: 'column',
    width: '47%',
  },
  assetContent: {
    backgroundColor: '#F9F9F9',
  },
  assetItemRight: {
    marginTop: -20,
  },

  assetItemLeft: {
    marginLeft: -15,
  },
  buttonAddAsset: {
    backgroundColor: defaultColor.primary,
    height: 36,
  },
  containerStyle: {
    marginLeft: 15,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    marginLeft: 8,
  },
});
