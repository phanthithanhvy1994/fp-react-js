import {StyleSheet} from 'react-native';
import {defaultColor} from '../../../../styles/theme/variables/platform';

export const configToggle = {
  trackColorFalse: defaultColor.extraLightGray,
  trackColorTrue: defaultColor.primary,
  defaultWhileColor: defaultColor.white,
};

export const styles = StyleSheet.create({
  rowContainer: {
    backgroundColor: defaultColor.white,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    backgroundColor: defaultColor.extraLightGray,
    borderBottomWidth: 0,

    paddingLeft: 5,
  },
  title: {
    color: defaultColor.black,
  },

  titleQuantity: {
    color: defaultColor.black,
    right: 24,
    fontWeight: 'bold',
    position: 'absolute',
    fontSize: 16,
  },

  materialCode: {
    width: '60%',
  },
  unitLabel: {
    width: '100%',
    flexDirection: 'row',
    paddingBottom: 5,
  },

  branchCode: {
    width: '40%',
    alignItems: 'center',
  },

  quantityNumber: {
    width: '30%',
    alignItems: 'center',
    marginTop: -20,
    position: 'absolute',
    right: 0,
    top: '50%',
  },

  materialField: {
    color: defaultColor.black,
    flexDirection: 'row',
  },

  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  photo: {
    height: 60,
    width: 60,
    marginRight: 10,
  },
  receivedStyle: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 0,
    backgroundColor: defaultColor.white,
  },
  fieldReceivedBottom: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    backgroundColor: defaultColor.extraLightGray,
  },

  received: {
    marginLeft: 10,
    marginTop: 3,
  },

  deliveryField: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'red',
    marginBottom: 10,
  },

  fieldContent: {
    width: '100%',
    borderWidth: 0,
  },

  receivedField: {
    flexDirection: 'row',
    backgroundColor: defaultColor.extraLightGray,
    marginBottom: 1,
    padding: 10,
    width: '45%',
    marginLeft: 5,
  },

  sizeField: {
    width: '100%',
  },
});
