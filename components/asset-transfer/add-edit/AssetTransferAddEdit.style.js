import {StyleSheet} from 'react-native';
import {defaultColor, borderStyle, defaultSize} from '../../../styles/theme/variables/platform';

export const styles = StyleSheet.create({
  contentContainer: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 20,
  },
  viewItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 13,
    paddingTop: 16
  },
  viewQty: {
    position: 'absolute',
    flexDirection: 'row',
    right: 24,
    width: 90,
    backgroundColor: defaultColor.secondary,
    justifyContent: 'center',
    borderRadius: 10,
  },
  textQty: {
    color: defaultColor.white,
  },
  // bottom buton
  fullWidthBtn: {
    height: 36,
    backgroundColor: defaultColor.primary,
    borderColor: borderStyle.borderColor,
    borderStyle: borderStyle.borderStyle,
    borderWidth: 1,
  },
  fullWidthBtnLabel: {
    color: defaultColor.white
  },
  contentItem: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  icon: {color: defaultColor.white},
  iconSize: {
    width: defaultSize.icon,
  },

  rowBack: {
    backgroundColor: `${defaultColor.white}`,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
  },

  deleteBtn: {
    backgroundColor: defaultColor.danger,
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    right: 16,
    marginTop: 20,
    marginLeft: 16,
    marginRight: -16,
    // marginBottom: 16,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    width: 44,
    justifyContent: 'center',
    top: 0,
    bottom: 0
  },

  bgWhite: {
    backgroundColor: defaultColor.white,
  },
  bgLigthGreen: {
    backgroundColor: defaultColor.lightBlue,
    marginLeft: -16,
    marginRight: -16,
  },
  
  viewQtyAR:{
    position: 'absolute',
    flexDirection: 'row',
    right: 24,
    width: 90,
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 'bold'
  },
  assetNoLabel: {
    paddingLeft: 16,
    paddingBottom: 16,
    paddingTop: 16
  },
  isClicking: {
    textDecorationLine: 'underline',
  },
  activeField: {
    paddingTop: 8
  },
  fieldsArray: {
  }
});
