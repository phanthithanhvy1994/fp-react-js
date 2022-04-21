import { StyleSheet } from 'react-native';
import {
  borderStyle,
  defaultColor,
} from '../../../styles/theme/variables/platform';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lastViewCtn: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  lastViewFieldsCtn: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lastViewFieldsLeft: {
    width: '60%'
  },

  lastViewFieldsRight: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  //Quantity field
  qtyFld: { height: 62, paddingLeft: 8 },
  customView: {
    width: '40%',
  },
  fieldContainer: {
    minHeight: 28,
    borderBottomWidth: 0,
    marginLeft: 0,
    marginBottom: 8,
    alignItems: 'flex-start',
    paddingRight: 6,
  },
  selectedItem: {
    justifyContent: 'space-between',
    borderStyle: borderStyle.borderStyle,
    borderColor: borderStyle.borderColor,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderRadius: 2,
    height: 36,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: defaultColor.white,
  },

  customQuantityView: {
    width: '100%',
    flex: 1,
    height: 62,
    paddingTop: 18,
  },
  customPOQuantityView: {
    width: '60%',
    position: 'absolute',
    right: 0,
    marginRight: 10,
    backgroundColor: defaultColor.extraLightGray,
    paddingBottom: 10,
  },
  customDOQuantityView: {
    width: '58%',
    position: 'absolute',
    right: 5,
    marginTop: 16,
    backgroundColor: defaultColor.extraLightGray,
  },
});
