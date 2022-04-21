import {StyleSheet} from 'react-native';
import {
  borderStyle,
  defaultColor,
} from '../../../../styles/theme/variables/platform';

export const styles = StyleSheet.create({
  scanContainer: {
    minHeight: 36,
    width: '100%',
    borderBottomWidth: 0,
    marginLeft: 0,
    elevation: 0,
    backgroundColor: defaultColor.white,
  },
  alignContent: {
    justifyContent: 'space-between',
  },
  scan: {
    backgroundColor: defaultColor.white,
    borderStyle: borderStyle.borderStyle,
    borderColor: defaultColor.primary,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 2,
    marginLeft: 0,
    height: 36,
  },
  scanActive: {
    opacity: 1,
  },
  input: {
    height: 36,
    paddingRight: 6,
    fontSize: 10,
    opacity: 0.3,
  },
  button: {
    backgroundColor: defaultColor.white,
    opacity: 0.3,
    width: 32,
    height: 32,
    marginLeft: 6,
    marginRight: -8,
    paddingTop: 0,
    paddingBottom: 0,
    elevation: 0,
    justifyContent: null,
  },
  icon: {
    fontSize: 24,
    color: defaultColor.primary,
  },
  quickScan: {width: '46%'},
  entryScan: {width: '53%'},
  flexWidth: {width: '49%'},
  quickScanEDA61K: {width: '46%'},
  entryScanEDA61K: {width: '56%', marginLeft: 2},

  inputEDA61K: {
    height: 36,
    paddingRight: 6,
    fontSize: 9,
    opacity: 0.3,
  },
});
