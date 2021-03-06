import {StyleSheet, Dimensions} from 'react-native';
import {
  defaultColor,
  borderStyle,
} from '../../../../styles/theme/variables/platform';

export const Styles = StyleSheet.create({
  container: {
    padding: 6,
    flex: 1,
    height: Dimensions.get('window').height,
  },
  fixedFooter: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 0,
  },
  flexRow: {flexDirection: 'row'},
  scanning: {flex: 0.8, justifyContent: 'flex-start'},
  viewEditable: {
    backgroundColor: defaultColor.white,
    flex: 1,
  },
  flexHeight: {marginBottom: 50},
  autoHeight: {marginBottom: 90},
  labelContainer: {
    borderBottomWidth: 0,
    height: 16,
  },
  fieldContainer: {
    minHeight: 2,
    borderBottomWidth: 0,
    marginLeft: 2,
    alignItems: 'flex-start',
    width: '30%',
  },
  refFieldContainer: {
    minHeight: 2,
    borderBottomWidth: 0,
    marginLeft: 0,
    alignItems: 'flex-start',
    width: '35%',
  },
  fieldItem: {
    justifyContent: 'space-between',
    backgroundColor: defaultColor.secondary,
    borderStyle: borderStyle.borderStyle,
    borderColor: borderStyle.borderColor,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 2,
    height: 28,
    marginBottom: 4,
  },
  button: {
    backgroundColor: defaultColor.white,
    width: 24,
    height: 24,
    paddingTop: 0,
    paddingBottom: 0,
    elevation: 0,
    marginLeft: 5,
  },
  icon: {
    fontSize: 20,
    color: defaultColor.primary,
  },
  recipient: {
    borderStyle: borderStyle.borderStyle,
    borderColor: defaultColor.primary,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 2,
    marginLeft: 0,
    width: '100%',
    height: 28,
  },
  recipientInput: {
    height: 36,
    lineHeight: 10,
    paddingBottom: 8,
    paddingLeft: 0,
    fontSize: 10,
  },
  fieldRecipient: {
    minHeight: 2,
    borderBottomWidth: 0,
    marginLeft: 0,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    paddingRight: 2,
  },
  yearFieldContainer: {
    minHeight: 2,
    borderBottomWidth: 0,
    marginLeft: 0,
    alignItems: 'flex-start',
    width: '33%',
    maxWidth: '34%',
  },
  yearFieldItem: {
    backgroundColor: defaultColor.secondary,
    borderStyle: borderStyle.borderStyle,
    borderColor: borderStyle.borderColor,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 2,
    height: 28,
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  fieldDateContainer: {
    minHeight: 2,
    borderBottomWidth: 0,
    marginLeft: 0,
    alignItems: 'flex-start',
    width: '29%',
    paddingRight: 2,
  },
});
