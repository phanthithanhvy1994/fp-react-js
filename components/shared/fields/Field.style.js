import { StyleSheet } from 'react-native';
import {
  borderStyle,
  defaultColor,
  defaultSize,
} from '../../../styles/theme/variables/platform';

export const configToggle = {
  trackColorFalse: defaultColor.disabled,
  trackColorTrue: defaultColor.primary,
  defaultWhileColor: defaultColor.white,
};

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  labelContainer: {
    borderBottomWidth: 0,
    height: 18,
  },
  errorsLabelContainer: {
    borderBottomWidth: 0,
    maxHeight: 40,
  },
  labelText: { fontSize: 12 },
  disabledOpacity: {
    opacity: 0.4,
  },

  //Quantity field
  quantityField: {
    borderBottomWidth: 0,
    textAlign: 'center',
    fontSize: 16,
    paddingTop: 6,
    paddingBottom: 6,
    lineHeight: 18,
  },
  quantityFieldDisabled: {
    opacity: 0.4,
  },
  // labelTextQuantity:{fontSize:10},
  btnQuantity: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  fieldItemQty: {
    justifyContent: 'space-between',
    borderStyle: borderStyle.borderStyle,
    borderColor: borderStyle.borderColor,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 2,
    height: 36,
    width: '100%',
    flexDirection: 'row',
  },
  qtyIcon: {
    color: defaultColor.white,
    width: 24,
  },

  errorText: {
    color: defaultColor.danger,
    width: '100%',
  },
  fieldContainer: {
    minHeight: 28,
    borderBottomWidth: 0,
    marginLeft: 0,
    marginBottom: 8,
    alignItems: 'flex-start',
    paddingRight: 6,
  },
  fieldItem: {
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
  },
  inputText: {
    fontSize: 12,
  },
  button: {
    backgroundColor: defaultColor.white,
    width: 24,
    height: 24,
    marginLeft: 16,
    marginRight: 6,
    paddingTop: 0,
    paddingBottom: 0,
    elevation: 0,
  },
  icon: {
    color: defaultColor.primary,
  },
  sizeIcon: 16,
  recipient: {
    borderStyle: borderStyle.borderStyle,
    borderColor: defaultColor.primary,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderRadius: 2,
    marginLeft: 0,
    minWidth: 302,
    width: '100%',
    height: 32,
  },
  recipientInput: {
    height: 36,
    lineHeight: 18,
    paddingLeft: 8,
    paddingTop: 1,
    paddingBottom: 0,
    fontSize: 12,
  },
  element: { justifyContent: 'space-between' },
  dateContainer: {
    minHeight: 44,
    width: '47%',
    marginLeft: 0,
    borderWidth: 0,
    borderBottomWidth: 0,
    justifyContent: 'space-around',
    paddingLeft: 0,
  },
  labelTo: {
    marginTop: 28,
    color: defaultColor.text,
    textAlign: 'center',
    alignItems: 'center',
  },
  dateItem: {
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: defaultColor.white,
    borderStyle: borderStyle.borderStyle,
    borderColor: borderStyle.borderColor,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderRadius: 2,
    height: 36,
    marginLeft: 3,
  },
  labelDate: {
    flex: 1,
    width: '100%',
    marginLeft: 10,
  },
  flexGird: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gird: {
    flexDirection: 'column',
    width: '100%',
  },
  flexWidth: {
    width: '50%',
  },
  autoWidth: {
    width: 'auto',
  },
  input: {
    paddingBottom: 8,
    fontSize: 12,
    lineHeight: 18,
  },
  dateIcon: {
    position: 'absolute',
    right: 8,
    color: defaultColor.primary,
  },
  dateIconSize: {
    width: 16,
  },
  require: {
    color: defaultColor.error,
    marginLeft: -4,
  },
  picker: {
    alignItems: 'center',
    marginLeft: 2,
  },
  pickerItem: {
    color: defaultColor.text,
  },
  fieldCheckbox: {
    borderBottomWidth: 0,
    minHeight: 28,
    marginLeft: 0,
    paddingRight: 0,
    justifyContent: 'center',
  },
  fieldPadding: {
    paddingTop: 8,
  },
  itemCheckbox: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 0,
    height: 28,
  },
  checkbox: {
    width: 'auto',
    position: 'absolute',
    left: 0,
    backgroundColor: defaultColor.primary,
    borderColor: defaultColor.primary,
  },
  labelCheckbox: {
    fontSize: 12,
    paddingLeft: 25,
  },
  activeField: {
    backgroundColor: defaultColor.white,
  },
  disableField: {
    backgroundColor: defaultColor.disabled,
  },
  inlineBtnAdd: {
    flexDirection: 'row',
    width: '90%',
    borderBottomWidth: 0,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderLeftWidth: 0.5,
    marginLeft: 4,
    backgroundColor: defaultColor.primary,
    paddingLeft: 9,
  },
  iconAdd: {
    color: defaultColor.white,
  },
  actionChildBtn: {
    marginTop: -3,
    marginLeft: 1,
    backgroundColor: defaultColor.neutral,
  },
  childIcon: {
    marginLeft: 2,
    width: 30,
    color: defaultColor.white,
    fontSize: 16,
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
  iconSize: {
    width: defaultSize.icon,
  },
  placeholderStyle: { color: defaultColor.lightGray },
  textContainer: {
    minHeight: 14,
    borderBottomWidth: 0,
    marginLeft: 0,
    marginBottom: 8,
    alignItems: 'flex-start',
    paddingRight: 6,
  },
  labelTextOnly: {
    fontSize: 12,
    top: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingLeft: 2,
  },
  scanStyle: { color: defaultColor.placeHolder },
  addedFieldItemList: {
    height: 36,
    width: '100%',
    borderBottomWidth: 0,
    marginTop: 4,
  },
  childAddedDisabledItem: {
    width: '91%',
    marginTop: 4,
  },
  wrapperRecipientAddIcon: {
    borderBottomWidth: 0,
  },
  wrapperRecipientInput: {
    width: '90%',
  },
  //Quantity field

  fldQty: {
    justifyContent: 'space-between',
    height: 36,
    width: '100%',
    flexDirection: 'row',
  },
  //Received
  transForm: { transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] },
  receivedField: {
    flexDirection: 'row',
    backgroundColor: defaultColor.extraLightGray,
    marginBottom: 1,
    padding: 10,
    width: '45%',
  },
  received: {
    marginLeft: 10,
    marginTop: 3,
  },
  customQuantityView: {
    width: '100%',
    flex: 1,
  },

  // Set width for text box of View Asset Tracking
  assetTransferNoItem: {
    width: '100%',
  }
});
