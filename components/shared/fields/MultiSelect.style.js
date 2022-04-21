import {StyleSheet} from 'react-native';
import {defaultColor} from '../../../styles/theme/variables/platform';

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: defaultColor.white,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    padding: 16,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 360,
    width: '98%',
  },
  openButton: {
    width: '100%',
  },
  textStyle: {
    color: defaultColor.text,
    textAlign: 'center',
    paddingLeft: 8,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'relative',
    top: 10,
    height: 46,
    width: '100%',
  },
  buttonClearStyle: {
    height: 36,
    backgroundColor: defaultColor.white,
    borderColor: defaultColor.white,
    borderRadius: 2,
    borderWidth: 1,
    marginRight: 7,
    width: 94,
  },
  buttonPrimaryStyle: {
    height: 36,
    width: 94,
    backgroundColor: defaultColor.primary,
    justifyContent: 'space-evenly',
    borderRadius: 0,
  },
  titleStyle: {fontSize: 14, color: defaultColor.white},
  titleOutLineStyle: {fontSize: 14, marginLeft: 6, color: defaultColor.outline},
  textColor: {color: defaultColor.text},
  primaryColor: {color: defaultColor.primary},
  arrowIcon: {color: '#747474', marginRight: 8},
  backView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
});
