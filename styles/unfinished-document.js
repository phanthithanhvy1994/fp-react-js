import {defaultColor} from '../styles/theme/variables/platform';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginRight: 8,
    marginLeft: 8,
  },
  accordion: {
    borderWidth: 0,
  },
  header: {
    height: 36,
    borderWidth: 1,
    borderColor: defaultColor.primary,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
  },
  badge: {
    height: 25,
    minWidth: 25,
    marginRight: 8,
  },
  content: {
    backgroundColor: defaultColor.unfinishedDoc,
    marginLeft: 13,
    padding: 8,
    borderWidth: 1,
    borderColor: defaultColor.primary,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  MarginBottom: {
    marginBottom: 8,
  },
  colorPrimary: {
    color: defaultColor.primary,
  },
  icon: {
    color: defaultColor.black,
  },
  flexItem: {
    flex: 1,
  },
});
