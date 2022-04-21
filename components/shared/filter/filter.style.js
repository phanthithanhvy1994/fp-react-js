import {StyleSheet, Dimensions} from 'react-native';
import {defaultColor} from '../../../styles/theme/variables/platform';

export const FilterStyles = StyleSheet.create({
  container: {
    backgroundColor: defaultColor.white,
    position: 'absolute',
    right: 0,
    left: 24,
    padding: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: 51,
    borderBottomWidth: 2,
    borderBottomColor: defaultColor.primary,
    marginLeft: 16,
    marginRight: 16,
  },
  modalHeader: {
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    position: 'absolute',
    left: 0,
  },
  modalHeaderIcon: {
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 0,
    width: 36,
    paddingLeft: 18,
    height: 36,
  },
  modalBottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    paddingBottom: 16,
    paddingRight: 10,
    paddingTop: 0,
    width: '100%',
  },
  textDialog: {
    fontSize: 14,
    paddingBottom: 20,
  },

  modalView: {
    padding: 10,
    backgroundColor: defaultColor.white,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
