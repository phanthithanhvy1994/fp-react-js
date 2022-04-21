import { StyleSheet, Dimensions } from 'react-native';

import {
  defaultColor,
  defaultSize,
  borderStyle
} from '../../../styles/theme/variables/platform';

var width = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: `${defaultColor.white}`,
    padding: 8,
  },
  backTextWhite: {
    color: '#FFF',
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
    borderTopColor: borderStyle.borderColor,
    borderTopWidth: 0.1,
  },
  rowBack: {
    backgroundColor: `${defaultColor.white}`,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 44,
  },

  backRightBtnRight: {
    backgroundColor: defaultColor.error,
    right: 0,
    height: 124,
    marginTop: 8,
    marginRight: 8,
    marginBottom: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    width: 44,
  },
  backRightBtnLeft: {
    backgroundColor: defaultColor.secondary,
    right: 0,
    height: 124,
    marginTop: 8,
    marginLeft: 8,
    marginBottom: 8,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    width: 44,
    justifyContent: 'center',
  },
  icon: { color: defaultColor.white },
  iconSize: {
    width: defaultSize.icon,
  },
  viewContainer: {
    padding: 16,
  },
  textTitle: {
    fontWeight: 'bold',
  },
  textFailed: {
    backgroundColor: defaultColor.error,
    color: defaultColor.white,
  },
  textDraft: {
    backgroundColor: defaultColor.secondary,
    color: defaultColor.white,
  },
  textCompleted: {
    color: defaultColor.primary,
    borderColor: defaultColor.primary,
    borderWidth: 1,
  },
  textSubmitted: {
    color: defaultColor.white,
    backgroundColor: defaultColor.primary,
  },
  textInTransit: {
    color: defaultColor.secondary,
    borderColor: defaultColor.secondary,
    borderWidth: 1,
  },
  textCancelled: {
    color: defaultColor.white,
    backgroundColor: defaultColor.lightGray,
  },
  textStatus: {
    width: 100,
    height: 16,
    borderRadius: 200,
    textAlign: 'center',
    alignContent: 'center',
    flex: 1,
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 10,
  },
  viewInfo: { flexDirection: 'row' },
  textFont: { fontSize: 12, color: defaultColor.text },
  textTime: { color: defaultColor.primary, paddingLeft: 20 },
  btnCollapse: {
    position: 'absolute',
    right: 0,
    height: 30,
    width: 30,
  },
  iconCollapse: {
    height: 24,
    width: 24,
  },
  viewItem: {
    backgroundColor: defaultColor.extraLightGray,
    marginLeft: 8,
    marginRight: 8,
    marginTop: -8,
  },
  viewItemInfo: {
    marginLeft: 24,
    marginRight: 24,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
  },
  image: {
    marginRight: 8,
  },
  viewQty: {
    position: 'absolute',
    right: 0,
    top: 24,
  },
  viewNoRecord: {
    alignItems: 'center',
  },
  tableFooter: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: defaultColor.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconClose: {
    backgroundColor: defaultColor.white,
    color: defaultColor.lightGray,
    borderRadius: 100,
    width: 24,
    height: 24,
  },
  remainingTimeView: {
    position: 'absolute',
    right: 16,
    bottom: 10,
  },
  remainingTime: {
    position: 'absolute',
    right: 0,
    bottom: 10,
  },
  stepLabel: {
    position: 'absolute',
    right: 0,
    bottom: 40,
  },
});
