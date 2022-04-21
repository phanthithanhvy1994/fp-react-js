import {defaultColor} from '../../../../styles/theme/variables/platform';
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
  alignItems: {justifyContent: 'center'},
  flexRow: {flexDirection: 'row'},
  scanning: {
    flex: 0.8,
    justifyContent: 'flex-start',
  },
  viewDataDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flexWidth: {
    paddingBottom: 0,
    width: '33.33%',
  },
  widthLabel: {
    width: '50%',
  },
  textRecipient: {
    paddingRight: 5,
  },
  autoWidth: {
    paddingBottom: 4,
    width: '100%',
  },
  viewEditable: {
    backgroundColor: defaultColor.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexHeight: {marginBottom: 50},
  autoHeight: {marginBottom: 90},
  require: {color: defaultColor.primary},
  flexView: {flex: 1, marginRight: -5},
  widthBpName: {width: '66.67%'},
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
