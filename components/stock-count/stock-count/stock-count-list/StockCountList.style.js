import {StyleSheet} from 'react-native';
import {
  defaultColor,
  borderStyle,
} from '../../../../styles/theme/variables/platform';

export const stockStyle = StyleSheet.create({
  rowBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxWidth: 200,
  },
  flexRowBtn: {
    justifyContent: 'space-between',
    height: 34,
  },
  rowSearch: {
    flex: 1,
    marginTop: -6,
  },
  rowContainer: {
    height: 50,
  },
  flexContainer: {
    height: 85,
  },
  widthBtn: {
    width: 136,
    height: 32,
    borderRadius: 2,
    backgroundColor: defaultColor.primary,
  },
  flexWidthBtn: {
    width: 96,
    marginLeft: 5,
    height: 32,
    borderRadius: 2,
    backgroundColor: defaultColor.primary,
  },
  btnTitle: {
    fontSize: 14,
    lineHeight: 16,
    paddingLeft: 5,
  },
  viewSearch: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  viewBtn: {
    height: 80,
    paddingLeft: 16,
    paddingRight: 16,
  },
  viewEditable: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMargin: {
    marginLeft: -16,
    marginRight: -16,
    height: 80,
  },
  flexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btnHightlight: {
    backgroundColor: defaultColor.filterColor,
    borderColor: defaultColor.primary,
    borderWidth: 2,
  },
  btnDefault: {backgroundColor: defaultColor.primary},
});

export const searchFieldStyle = StyleSheet.create({
  fieldContainer: {
    minHeight: 32,
    borderBottomWidth: 0,
    marginLeft: 0,
    marginBottom: 8,
    marginTop: 16,
  },

  fieldItem: {
    backgroundColor: defaultColor.secondary,
    borderStyle: borderStyle.borderStyle,
    borderColor: defaultColor.primary,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 2,
    marginLeft: 0,
    height: 32,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    borderBottomWidth: 0,
  },
  button: {
    backgroundColor: defaultColor.secondary,
    paddingTop: 0,
    paddingBottom: 0,
    elevation: 0,
    position: 'absolute',
    right: 0,
    height: 28,
  },
  icon: {
    fontSize: 32,
    color: defaultColor.primary,
  },
  input: {
    textAlign: 'center',
  },
});

export const filterFieldStyle = StyleSheet.create({
  labelContainer: {
    fontSize: 12,
  },
});
