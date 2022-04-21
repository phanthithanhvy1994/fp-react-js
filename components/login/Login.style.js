import {defaultColor, defaultSize} from '../../styles/theme/variables/platform';

export default {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 38,
    paddingLeft: 38,
    flex: 1,
  },
  statusbarColor: {color: defaultColor.statusbarColor},
  row: {
    alignItems: 'center',
    textAlign: 'center',
    width: 300,
    maxHeight: 120,
    marginLeft: 0,
    flex: 1,
  },
  iconItem: {
    marginLeft: 8,
    color: defaultColor.primary,
  },
  rowSignIn: {
    alignItems: 'center',
    height: 36,
    textAlign: 'center',
    width: 300,
    marginLeft: 0,
    marginTop: -20,
  },

  fieldContainer: {
    minHeight: 36,
    height: 36,
    borderColor: 'transparent',
    width: 300,
    marginTop: -60,
    marginLeft: 0,
  },
  fieldUsername: {
    borderRadius: 4,
    backgroundColor: defaultColor.extraLightGray,
    borderColor: 'transparent',
    marginLeft: 0,
  },
  rowImg: {
    alignItems: 'center',
    textAlign: 'center',
    height: 145,
  },
  rowTitle: {
    alignItems: 'center',
    height: 60,
    textAlign: 'center',
    marginTop: 18,
  },
  image: {
    marginTop: -16,
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 52,
    lineHeight: 61,
  },
  iconShowPassword: {marginRight: 10, color: defaultColor.text},
  btnSignIn: {
    elevation: 0,
    borderRadius: 2,
    width: 300,
    text: {
      color: defaultColor.white,
    },
    icon: {
      position: 'absolute',
      color: defaultColor.white,
      left: 8,
    },
    backgroundColor: defaultColor.secondary,
  },
  errorsMessage: {
    top: -30,
    color: {
      color: defaultColor.danger,
    },
    maxWidth: 220,
  },
  btn: {
    height: 36,
    paddingRight: 16,
    paddingLeft: 16,
    borderRadius: 2,
    backgroundColor: defaultColor.white,
    justifyContent: 'space-around',
  },
  iconSize: {
    size: defaultSize.icon,
  },
};
