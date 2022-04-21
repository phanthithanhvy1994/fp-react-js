import {defaultColor, defaultSize} from '../../styles/theme/variables/platform';

export default {
  container: {
    backgroundColor: defaultColor.gray,
  },
  content: {
    porttrait: {marginBottom: 48},
    landscape: {
      marginBottom: 16,
    },
  },
  body: {
    marginTop: 4,
    marginBottom: 4,
  },
  inputDocSAP: {
    backgroundColor: defaultColor.gray,
    borderRadius: 300,
    height: 24,
    paddingBottom: 2,
    fontSize: 13,
    lineHeight: 8,
    marginRight: 7,
    marginLeft: 7,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    right: 0,
  },
  listItem: {
    width: '100%',
    borderRadius: 0,
    height: 52,
    marginLeft: 0,
    backgroundColor: defaultColor.white,
    borderBottomWidth: 1,
    borderBottomColor: defaultColor.gray,
    text: {
      color: defaultColor.text,
      paddingLeft: 16,
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
  },
  viewLogout: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItem: 'center',
    left: 0,
    right: 0,
    bottom: 10,
    landscapeMode: {position: 'absolute'},
  },
  btnLogout: {
    backgroundColor: defaultColor.secondary,
    borderRadius: 2,
    elevation: 0,
    width: 300,
    icon: {
      position: 'absolute',
      color: defaultColor.white,
      left: 8,
    },
  },
  iconSize: {
    size: defaultSize.icon,
  },
};
