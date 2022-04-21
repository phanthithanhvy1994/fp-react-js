import {StyleSheet} from 'react-native';
import {defaultColor} from '../styles/theme/variables/platform';

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  headerItem: {
    width: '85%',
  },
  contentImage: {
    height: 72,
    width: 72,
  },
  contentLeft: {
    flex: 0.3,
  },
  backgroundGrey: {
    backgroundColor: '#F9F9F9',
  },
  itemContent: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  item: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  itemNoneBorder: {
    marginLeft: 20,
    marginRight: 20,
  },
  rowBack: {
    backgroundColor: defaultColor.danger,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    color: 'white',
  },
  iconRowBack: {
    color: 'white',
    fontSize: 24,
  },
  textInline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
