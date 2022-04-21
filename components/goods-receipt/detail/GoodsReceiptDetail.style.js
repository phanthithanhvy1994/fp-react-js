import { StyleSheet, Dimensions } from 'react-native';
import { defaultColor, borderStyle, defaultSize } from '../../../styles/theme/variables/platform';

var width = Dimensions.get('window').width;

export const GRDetailsStyles = StyleSheet.create({
  goodsReceiptDetailsCtn: {
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1
  },

  lineStepBarCover: {
    position: 'absolute',
    top: 34,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: defaultColor.lightGray,
  },

  stepActionBtn: {
    flexDirection: 'row',
    paddingBottom: 40,
    paddingTop: 16,
  },

  stepActionBtnChild: {
    flex: 1
  },

  disabledBtnStyle: {
    opacity: 0.4
  },

  iconBack: {
    position: 'absolute',
    left: 13,
    bottom: 5,
  },

  iconNext: {
    position: 'absolute',
    right: 13,
    bottom: 5,
  },

  buttonNextStyle: {
    height: 36,
    marginLeft: 3.25,
    marginRight: 0,
    backgroundColor: defaultColor.white,
    borderColor: defaultColor.lightGray,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonBackStyle: {
    height: 36,
    marginRight: 3.25,
    alignItems: 'flex-start',
    backgroundColor: defaultColor.white,
    borderColor: defaultColor.lightGray,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  buttonNextTextStyle: {
    color: defaultColor.text
  },

  cancelBtn: {
    height: 36,
    backgroundColor: defaultColor.white,
    borderColor: borderStyle.borderColor,
    borderStyle: borderStyle.borderStyle,
    borderWidth: 1,
  },
  submitBtn: {
    height: 36,
    backgroundColor: defaultColor.primary,
    color: defaultColor.white,
  },
  submitTextBtn: {
    color: defaultColor.white,
  },
  actionArea: {
    marginTop: -8,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'center'
  },

  actionChildArea: {
    paddingBottom: 16,
    flex: 1,
  },

  viewContainer: {
    padding: 16,
  },
  viewItem: {
    backgroundColor: defaultColor.extraLightGray,
    marginTop: 8,
  },
  viewInfo: {
    flex: 1,
    alignContent: 'flex-start',
  },
  viewItemInfo: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginRight: 8,
  },
  rightViewItemInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  viewQty: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textQty: {
  },
  textQtyOnly: {
  },
  textTitle: {
    fontWeight: 'bold',
  },
  textFont: { fontSize: 13, color: defaultColor.text },
  description: {
    maxWidth: '84%',
  },
  textBatchNo: { fontSize: 10, color: defaultColor.text, position: 'absolute', top: 0, right: 0 },
  textTime: { color: defaultColor.primary, paddingLeft: 20 },
  iconSize: {
    width: defaultSize.icon,
  },
  rowFront: {
    margin: 8,
    minHeight: 124,
    borderRadius: 8,
    backgroundColor: `${defaultColor.white}`,
    shadowColor: `${defaultColor.gray}`,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 4,
    minWidth: width - 32,
  },

  secondStepViewWrapper: {
  },

  overDeliveryArea: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 16,
    paddingRight: 16,
  },

  overDeliveryFieldLeft: {
    width: '56%' // is 70% of container width
  },

  overDeliveryFieldRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  overDeliveryFieldRightText: {
    paddingTop: 8
  },

  // Last View
  lastViewFieldsWrapper: {
    paddingLeft: 16,
    paddingRight: 16,
  },

  lastViewFieldsCtn: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
  lastViewFieldsLeft: {
    flex: 7,
  },

  lastViewFieldsRight: {
    flex: 3,
    alignItems: 'center',
  },
  lastViewFieldsRightText1: {
    paddingTop: 26,
  },
  lastViewFieldsRightText2: {
    paddingTop: 39,
  },
});
