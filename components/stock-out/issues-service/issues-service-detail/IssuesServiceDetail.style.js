import {
  defaultColor,
  borderStyle,
} from '../../../../styles/theme/variables/platform';
import {Dimensions} from 'react-native';

export default {
  container: {
    padding: 10,
    flex: 1,
    height: Dimensions.get('window').height,
  },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: defaultColor.white,
  },

  flexRow: {flexDirection: 'row'},
  scanning: {
    flex: 0.8,
    justifyContent: 'flex-start',
  },
  viewDataDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  flexWidth: {
    width: '33%',
  },
  autoWidth: {
    width: '100%',
  },
  alignItems: {justifyContent: 'center'},
  textRecipient: {paddingRight: 5},
  viewEditable: {
    backgroundColor: defaultColor.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexHeight: {marginBottom: 50},
  autoHeight: {marginBottom: 90},
  button: {
    backgroundColor: defaultColor.white,
    width: 24,
    height: 24,
    marginLeft: 8,
    paddingTop: 0,
    paddingBottom: 0,
    elevation: 0,
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
    width: 298,
    height: 28,
  },
  recipientInput: {
    height: 36,
    lineHeight: 10,
    paddingBottom: 8,
  },
  fieldRecipient: {
    minHeight: 2,
    borderBottomWidth: 0,
    marginLeft: 2,
    marginTop: 2,
    marginBottom: 2,
    paddingRight: 2,
    alignItems: 'flex-start',
    width: '100%',
    height: 28,
  },
  require: {color: defaultColor.primary},
  toast: {
    backgroundColor: defaultColor.outline,
  },
  flexView: {
    flex: 1,
    marginRight: -5,
  },
  labelBold: {
    fontWeight: 'bold',
  },
  viewPadding: {paddingBottom: 5},
  buttonDetail: {
    borderColor: defaultColor.primary,
    borderWidth: 1,
    backgroundColor: defaultColor.white,
  },
  textColor: {
    color: defaultColor.black,
  },
};
