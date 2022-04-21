import {StyleSheet} from 'react-native';
import {defaultColor} from '../../../styles/theme/variables/platform';

export const styles = StyleSheet.create({
  imageStyle: {
    width: 78,
    height: 78,
    margin: 2,
  },
  colorIcon: {
    color: defaultColor.error,
  },
  row: {
    // flexDirection: 'row',
  },
  btnUpload: {
    height: 72,
  },
  imgUpload: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carousel: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  btnDelete: {
    right: 8,
    top: 8,
    position: 'absolute',
    zIndex: 1,
  },
  icon: {color: defaultColor.error},
  iconSize: {
    width: 24,
  },

  // Zoom Image
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalView: {
    width: '98%',
    height: '98%',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonCloseModal: {
    right: 8,
    top: 8,
    position: 'absolute',
    zIndex: 1,
  },
  zoomedImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
