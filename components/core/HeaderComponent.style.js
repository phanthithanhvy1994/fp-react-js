import {defaultColor, defaultSize} from '../../styles/theme/variables/platform';

export default {
  title: {
    color: defaultColor.primary,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 16,
  },

  statusBar: {
    color: defaultColor.statusbarColor,
  },
  leftComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flexComponent: {flex: 0},
  bodyComponent: {alignItems: 'center', flex: 1},
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMenu: {
    paddingRight: 7,
    color: defaultColor.white,
  },
  icon: {
    color: defaultColor.primary,
  },
  displayFlex: {flex: 1},
  rightMenu: {
    maxWidth: 100,
  },
  headerTitle: {
    marginLeft: 8,
  },
  headerIcon: {
    marginLeft: 14,
  },
  userName: {color: defaultColor.primary, fontWeight: 'normal'},
  iconSize: {
    size: defaultSize.icon,
  },
  iconAdd: {
    color: defaultColor.secondary,
  },
  iconBack: {
    color: defaultColor.primary,
    fontSize: 32,
    marginTop: -2,
    paddingRight: 10,
  },
};
