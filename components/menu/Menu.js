import React, {Component} from 'react';
import {Dimensions} from 'react-native';

import {
  Container,
  Content,
  Button,
  Text,
  View,
  List,
  ListItem,
  Left,
} from 'native-base';

import {openMessageDialog} from '../../redux/message-dialog/MessageDialog.actions';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import {
  NumberOfDocumentsFromSAP,
  asyncStorageConst,
  buttonConstant,
  dialogConstant,
} from '../../constants/constants';
import MenuStyles from './Menu.style';
import {listItems, databaseDefine} from './menu.config';
import {userService} from '../../services/userService';
import {MESSAGE} from '../../constants/message';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../../selection.json';

import {detectPortrait} from '../../utils/functions';
import {tableConstant} from '../../database/Constant';
import {update, insert} from '../../services/database/CRUD';
import {searchWithPK} from '../../services/database/Search';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultNumberDocumentsSAP: NumberOfDocumentsFromSAP.defaultDocuments,
      maxNumberDocumentsSAP: NumberOfDocumentsFromSAP.maxDocumentsValue,
      numberDocumentsSAP: NumberOfDocumentsFromSAP.defaultDocuments,
      validateNumberDocumentsSAP: '',
      isPortTrait: false,
    };
  }

  _isMounted = true;

  componentDidMount() {
    this.detectOrientation();
    Dimensions.addEventListener('change', data => {
      const {height, width} = data.window;
      this.detectOrientation(width, height);
    });
    this.initialSetting();
  }
  componentWillUnmount() {
    this._isMounted = false;
    Dimensions.removeEventListener('change', this.detectOrientation());
  }
  initialSetting = async () => {
    const {defaultNumberDocumentsSAP} = this.state;

    try {
      const numDocSAP = await searchWithPK(
        tableConstant.name.CONFIG,
        databaseDefine.configNumDocSAP.name,
      );

      if (!numDocSAP) {
        insert(tableConstant.name.CONFIG, databaseDefine.configNumDocSAP);
        this.setState({validateNumberDocumentsSAP: defaultNumberDocumentsSAP});
      } else {
        this.setState({validateNumberDocumentsSAP: numDocSAP.value});
      }
    } catch (err) {}
  };
  detectOrientation = (screenWidth, screenHeight) => {
    let isPortrait = detectPortrait(screenWidth, screenHeight);
    if (this._isMounted) {
      this.setState({
        isPortTrait: isPortrait,
      });
    }
  };

  handleNumberOfDocSAP = value => {
    const {maxNumberDocumentsSAP} = this.state;
    // using a RegExp to replace any non digit
    let validateValue = value.replace(/[^0-9]/g, '');

    if (validateValue > maxNumberDocumentsSAP) {
      this.callMessage(MESSAGE.M014);
      validateValue = maxNumberDocumentsSAP;
    }

    this.setState({
      validateNumberDocumentsSAP: validateValue,
    });
  };

  onSubmitEditing = e => {
    const {defaultNumberDocumentsSAP, validateNumberDocumentsSAP} = this.state;

    this.setState(
      {
        validateNumberDocumentsSAP: +validateNumberDocumentsSAP // syntax es6: parse number
          ? validateNumberDocumentsSAP
          : defaultNumberDocumentsSAP,
      },
      () => {
        update(tableConstant.name.CONFIG, databaseDefine.configNumDocSAP.name, {
          value: `${this.state.validateNumberDocumentsSAP}`,
        });
      },
    );
  };

  handleLogout = async () => {
    const {navigation} = this.props;
    await AsyncStorage.removeItem(asyncStorageConst.TOKEN);
    await AsyncStorage.removeItem(asyncStorageConst.UNAME);
    userService.logout();
    navigation.navigate('Login');
  };

  handleBeforeLogout = () => {
    this.callMessage(MESSAGE.M006);
  };

  handleActionOnDialog = () => {
    this.handleLogout();
  };

  callMessage = message => {
    const {t} = this.props;
    const {maxNumberDocumentsSAP} = this.state;
    let messObj;
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
              action: () => this.handleActionOnDialog(),
            },
          ],
        };
        break;
      case MESSAGE.M014:
        messObj = {
          content: t(MESSAGE.M014, {value: maxNumberDocumentsSAP}),
          buttons: [
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.NONE_FUNCTION,
            },
          ],
        };
        break;
      case MESSAGE.M010:
        messObj = {
          content: t(message),
          buttons: [
            {
              name: buttonConstant.BUTTON_OK,
              type: dialogConstant.button.NONE_FUNCTION,
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
    const {t, navigation} = this.props;
    const {isPortTrait} = this.state;

    return (
      <Container style={MenuStyles.container}>
        <Content
          style={[
            isPortTrait
              ? MenuStyles.content.porttrait
              : MenuStyles.content.landscape,
          ]}>
          {listItems.map((itemParent, indexParent) => {
            return (
              <List style={MenuStyles.body} key={indexParent}>
                {itemParent.items.map((itemChildren, indexChildren) => {
                  return (
                    <ListItem
                      key={indexChildren}
                      style={MenuStyles.listItem}
                      onPress={() => {
                        navigation.navigate(`${itemChildren.screen}`);
                      }}>
                      <Left>
                        <Text style={MenuStyles.listItem.text}>
                          {t(`${itemChildren.title}`)}
                        </Text>
                      </Left>
                    </ListItem>
                  );
                })}
              </List>
            );
          })}
        </Content>
        <View
          style={[
            MenuStyles.viewLogout,
            isPortTrait && MenuStyles.viewLogout.landscapeMode,
          ]}>
          <Button
            style={MenuStyles.btnLogout}
            iconLeft
            full
            onPress={() => this.handleBeforeLogout()}>
            <Icon
              style={MenuStyles.btnLogout.icon}
              size={MenuStyles.iconSize.size}
              name="icon-logout"
            />
            <Text uppercase={false}>{t('Logout')}</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

export default withTranslation()(Menu);
