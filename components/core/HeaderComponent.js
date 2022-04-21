import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';

import {connect} from 'react-redux';
import {View, BackHandler} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {withNavigation, NavigationActions} from 'react-navigation';
import {Header, Left, Right, Button, Icon, Text} from 'native-base';

import {openMessageDialog} from '../../redux/message-dialog/MessageDialog.actions';
import {notificationService} from '../../services/notificationService';
import {filterService} from '../../services/filterService';
import {calendarService} from '../../services/calendarService';
import {apiService} from '../../services/apiService';

import {MESSAGE} from '../../constants/message';
import {
  buttonConstant,
  dialogConstant,
  NotificationType,
  asyncStorageConst,
} from '../../constants/constants';

import HeaderComponentStyles from './HeaderComponent.style';

import icoMoonConfig from '../../selection.json';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';

const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);
// // [HONDAIPB-] - 16/07/2020 - Cancel previous request if HardwareBack press
let promiseInProgress = false;

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  componentDidMount() {
    this.setUsername();
    BackHandler.addEventListener('hardwareBackPress', this.callGoBack);
    // [#HONDAIPB-CR] - 16/07/2020 - Cancel previous request if HardwareBack press
    // Call event to clear filter
    this.subscription = notificationService
      .onNotify()
      .subscribe(notification => {
        switch (notification.type) {
          case NotificationType.IS_PROMISE_IN_PROGRESS:
            promiseInProgress = true;
            break;
          case NotificationType.IS_NOT_PROMISE_IN_PROGRESS:
            promiseInProgress = false;
            break;
          default:
            break;
        }
      });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.callGoBack);
    this.subscription.unsubscribe();
  }

  async setUsername() {
    const username = await AsyncStorage.getItem('UNAME');
    this.setState({username});
  }

  // [HONDAIPB-CR] - 15/07/2020 - Cancel previous request if HardwareBack press
  // Cancel req when tap HardwareBack
  handleCancelReq = (isPostReq = false) => {
    let path = '',
      params = {},
      header = {},
      isCancel = true;
    if (isPostReq) {
      return apiService.post(path, params, header, isCancel);
    } else {
      return apiService.get(path, params, header, isCancel);
    }
  };

  // [HONDAIPB-Update] - 24/06/2020 - Handle tap on menu btn action
  handleGoMenu = () => {
    const {navigation} = this.props;
    const {navigate} = navigation;
    // [#HONDAIPB-FixBug] - 24/06/2020 - Filter can not refresh after navigate others screen
    // Notify event to clear filter
    notificationService.notify(NotificationType.IS_CLEAR_FILTER);
    // [HONDAIPB-CR] - 15/07/2020 - Cancel previous request if HardwareBack press
    // In main screen get req => isPostReq = false
    // Await cancel execute
    navigate('Menu');
  };

  callGoBack = () => {
    const {
      navigation,
      isMenuScreen,
      isMainScreen,
      isHomeScreen,
      withoutDialog,
      backToLogin,
    } = this.props;

    const {navigate, dispatch} = navigation;
    // const {navigate, dispatch, state} = navigation;
    // console.log('state.route: ', state.routes); // Get Route stack

    const token = AsyncStorage.getItem(asyncStorageConst.TOKEN);
    if (isMainScreen) {
      if (isHomeScreen) {
        // [HONDAIPB-#501#502#503] - At home screen -> logout confirm
        this.callMessage(MESSAGE.M006);
      } else {
        // Main screen
        this.handleGoMenu();
      }
    } else {
      if (isMenuScreen) {
        navigate('Home');
      } else {
        if (withoutDialog) {
          if (backToLogin) {
            token ? navigate('Menu') : navigate('Login');
          } else {
            dispatch(NavigationActions.back());
            return true;
          }
        } else {
          if (promiseInProgress) {
            // Await cancel execute
            let awaitExec = this.handleCancelReq(true);
            this.callMessage(MESSAGE.M020);
          } else {
            this.callMessage(MESSAGE.REDIRECT_WITHOUT_SAVING);
          }
        }
      }
    }
  };

  // [HONDAIPB-#501#502#503] - Add new function optimize logic code & fix bug
  // This function call message dialog & pass properties to dialog
  callMessage = message => {
    const {t, navigation} = this.props;
    const {navigate, dispatch} = navigation;

    let messObj = {};
    switch (message) {
      case MESSAGE.M006:
        messObj = {
          content: t(MESSAGE.M006),
          buttons: [
            {
              name: buttonConstant.BUTTON_CANCEL,
              type: dialogConstant.button.NONE_FUNCTION,
            },
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.FUNCTION,
              action: () => {
                AsyncStorage.removeItem(asyncStorageConst.TOKEN);
                navigate('Login');
              },
            },
          ],
        };
        break;
      case MESSAGE.REDIRECT_WITHOUT_SAVING:
        messObj = {
          content: t(message),
          buttons: [
            {
              name: buttonConstant.BUTTON_CANCEL,
              type: dialogConstant.button.FUNCTION,
            },
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.FUNCTION,
              action: () => {
                dispatch(NavigationActions.back());
              }
            },
          ],
        };
        break;
      case MESSAGE.M020:
        messObj = {
          content: t(message),
          buttons: [
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.FUNCTION,
              action: () => this.callMessage(MESSAGE.M007),
            },
          ],
        };
        break;
      default:
        break;
    }
    openMessageDialog(messObj);
  };

  render() {
    const {
      isMenuScreen,
      isMainScreen,
      isHomeScreen,
      isAddScreen,
      screenName,
      navigation,
      title,
      buttonHeaderStore,
      isCalendar,
      isShowCustomBtnHeader
    } = this.props;
    const {username} = this.state;
    return (
      <View>
        <Header androidStatusBarColor={HeaderComponentStyles.statusBar.color}>
          <Left style={HeaderComponentStyles.leftComponent}>
            {isMenuScreen ? null : isMainScreen || isHomeScreen ? (
              <>
                <Button transparent onPress={() => this.handleGoMenu()}>
                  <IcoMoon
                    style={HeaderComponentStyles.icon}
                    size={HeaderComponentStyles.iconSize.size}
                    name="icon-menu"
                  />
                </Button>
                <Text uppercase={false} style={HeaderComponentStyles.title}>{title}</Text>
              </>
            ) : (
              <Button transparent onPress={() => this.callGoBack()}>
                <Icon
                  style={HeaderComponentStyles.iconBack}
                  type="FontAwesome"
                  name="angle-left"
                />
                <Text uppercase={false} style={HeaderComponentStyles.title}>{title}</Text>
              </Button>
            )}
            {isMenuScreen && (
              <>
                <Text style={HeaderComponentStyles.userName}>Username</Text>
              </>
            )}
          </Left>
          {isMainScreen && (
            <Right style={HeaderComponentStyles.rightMenu}>
              <Button
                transparent
                onPress={() => filterService.filterFire(true)}>
                <IcoMoon
                  style={HeaderComponentStyles.icon}
                  size={HeaderComponentStyles.iconSize.size}
                  name="icon-search"
                />
              </Button>
              {isAddScreen && (
                <Button
                  transparent
                  onPress={() => navigation.navigate(`${screenName}`)}>
                  <IcoMoon
                    style={HeaderComponentStyles.iconAdd}
                    size={HeaderComponentStyles.iconSize.size}
                    name="icon-add"
                  />
                </Button>
              )}
            </Right>
          )}
          {isCalendar && (
            <Right style={HeaderComponentStyles.rightMenu}>
              <Button
                transparent
                onPress={() => calendarService.calendarFire(true)}>
                <IcoMoon
                  style={HeaderComponentStyles.icon}
                  size={HeaderComponentStyles.iconSize.size}
                  name="icon-calendar"
                />
              </Button>
              {isAddScreen && (
                <Button
                  transparent
                  onPress={() => navigation.navigate(`${screenName}`)}>
                  <IcoMoon
                    style={HeaderComponentStyles.iconAdd}
                    size={HeaderComponentStyles.iconSize.size}
                    name="icon-add"
                  />
                </Button>
              )}
            </Right>
          )}
          {buttonHeaderStore.isCustomBtn && isShowCustomBtnHeader &&            buttonHeaderStore.buttons.map((item, index) => {
              return (
              <Button
                key= {index}
                transparent
                onPress={item.action}>
                <Icon
                    style={item.type}
                    type="FontAwesome"
                    size={HeaderComponentStyles.iconSize.size}
                    name={item.name}
                />
              </Button>
            )}
          )}
        </Header>
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    // Get data details on grids from store map to props
    buttonHeaderStore: state.buttonHeaderStore,
  };
}
export default withNavigation(connect(mapStateToProps)(withTranslation()(HeaderComponent)));