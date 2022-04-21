import React from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import AsyncStorage from '@react-native-community/async-storage';

import {Image, StatusBar, Keyboard} from 'react-native';
import {Container, Text, Button, View} from 'native-base';
import {Row, Grid, Col} from 'react-native-easy-grid';

import Field from '../shared/fields/field';

import get from 'lodash/get';

import {
  loginFields,
  validationRules,
  settingField,
} from './Login.config';

import {userService} from '../../services/userService';

import {insert} from '../../services/database/CRUD';
import {searchWithPK} from '../../services/database/Search';

import {
  onChangeInput,
  getStateFields,
  trimContent,
  isConnectedToTheNetwork,
} from '../../utils/functions';

import {asyncStorageConst, databaseDefine} from '../../constants/constants';
import {MESSAGE} from '../../constants/message';
import {tableConstant} from '../../database/Constant';
import {screen} from '../../constants/constants';

import {loginImg} from '../../assets/images';
import icoMoonConfig from '../../selection.json';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';

import loginStyles from './Login.style';

const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);

function useOnMount(handler) {
  return React.useEffect(handler, []);
}

function Login({navigation}) {
  const {setValue, errors, register, handleSubmit} = useForm({
    reValidateMode: 'onSubmit',
    submitFocusError: false,
  });

  const {t} = useTranslation();
  const [fields, setFields] = React.useState([...loginFields]);
  const [newSettingField, setSettingField] = React.useState([...settingField]);
  const [errorFromSAP, setErrorFromSAP] = React.useState('');

  const [visibleDialog, setVisibleDialog] = React.useState(false);

  useOnMount(() => {
    // Register validate
    if (validationRules) {
      validationRules.forEach(valid => register(valid.name, valid.rule));
    }
    initialSetting();
  });

  const initialSetting = () => {
    AsyncStorage.getItem(asyncStorageConst.LATESTUNAME).then(resData => {
      const newFields = [...fields].map(item => {
        if (item.fieldName === 'userName') {
          return {...item, value: resData};
        }
        return item;
      });
      setFields(newFields);
      // Set new value to validate
      setValue('userName', resData);
    });
  };

  // [HONDAIPB-Fixbug] - 16/09/2020 - Data not sync when re-open dialog
  const syncSettingData = async () => {
    // Get URL setting from DB
    const url = await searchWithPK(
      tableConstant.name.CONFIG,
      databaseDefine.configUrl.name,
    );
    const SAPClient = await searchWithPK(
      tableConstant.name.CONFIG,
      databaseDefine.configSAPClient.name,
    );
    const SAPLanguage = await searchWithPK(
      tableConstant.name.CONFIG,
      databaseDefine.configSAPLanguage.name,
    );
    let fieldSetting = '';

    if (!url) {
      // Create URL setting to DB
      insert(tableConstant.name.CONFIG, databaseDefine.configUrl);
    } 
    // [HONDAIPB-Fixbug] - 16/09/2020 - Issue first launch setting is empty
    // Get DB data to field
    fieldSetting = onChangeInput(newSettingField, {
      target: url ? {value: url.value, name: 'url'} : databaseDefine.configUrl,
    });

    if (!SAPClient) {
      insert(tableConstant.name.CONFIG, databaseDefine.configSAPClient);
    } 
    fieldSetting = onChangeInput(
      fieldSetting ? fieldSetting : newSettingField,
      {
        target: SAPClient ? {value: SAPClient.value, name: 'clientCode'} : databaseDefine.configSAPClient,
      },
    );
    
    if (!SAPLanguage) {
      insert(tableConstant.name.CONFIG, databaseDefine.configSAPLanguage);
    } 
    fieldSetting = onChangeInput(
      fieldSetting ? fieldSetting : newSettingField,
      {
        target: SAPLanguage ? {value: SAPLanguage.value, name: 'clientLanguage'} : databaseDefine.configSAPLanguage,
      },
    );

    if (fieldSetting) {
      setSettingField(JSON.parse(JSON.stringify(fieldSetting)));
    }
  };

  const onValueChange = e => {
    const newFields = onChangeInput(fields, e);
    setFields(newFields);
    // Set new value to validate
    setValue(e.target.name, e.target.value);
    setErrorFromSAP('');
  };

  const onSubmit = async data => {
    // [#HONDAIPB-FixBug] - 25/06/2020 - Keyboard not hide after submit
    Keyboard.dismiss();
    //
    const isConnected = await isConnectedToTheNetwork();
    navigation.navigate(screen.home);
    if (!isConnected) {
      setErrorFromSAP(t(MESSAGE.M010));
      return;
    }

    const {userName, password} = data;
    const dataLogin = await userService.loginGetPermission(userName, password);
    const Hh_Authen = get(dataLogin, 'd.Hh_Authen', '');

    // Login Fail
    if (!Hh_Authen) {
      // [#HONDAIPB-CR] - 25/06/2020 - Handle logout after login errors case 200 blank
      userService.logout();
      //
      const message = get(dataLogin, 'error', MESSAGE.U003);
      // [HONDAIPB-CR] - 23/06/2020 - When login fails (no matter what reasons), Honda IT wants the app to clear the password field to blank.
      let e = {target: {name: 'password', value: ''}};
      onValueChange(e);
      //
      setErrorFromSAP(message);
      return;
    }

    userService.login(userName, password).then(async res => {
      const username = get(res, 'data.d.Uname', '');
      const token = get(res, 'headers.x-csrf-token', '');
      await AsyncStorage.setItem(asyncStorageConst.TOKEN, token);
      await AsyncStorage.setItem(asyncStorageConst.UNAME, username);
      await AsyncStorage.setItem(asyncStorageConst.LATESTUNAME, username);
      const dataNavigation = get(navigation, 'state.params.data', {});

      navigation.navigate(dataNavigation.detailPage || screen.home, {
        data: {headerId: dataNavigation.headerId},
      });
    });
  };

  // [#HONDAIPB-FixBug] - 26/06/2020 - The 2nd error append the 1st error, instead of clearing the 1st one first.
  // When enter wrong password => 1st error displayed, it's about incorrect password
  // Press the login immediately => 2nd error displayed, it's about blank field
  const callSAPErrorsMsg = () => {
    if (errorFromSAP !== '' && !errors.password) {
      return (
        <Text style={loginStyles.errorsMessage.color}>{t(errorFromSAP)}</Text>
      );
    }
  };

  return (
    <Container>
      <StatusBar backgroundColor={loginStyles.statusbarColor.color} />
      <Grid style={loginStyles.container}>
        <Row style={loginStyles.rowTitle}>
          <Text style={loginStyles.title}>{t('Welcome to')}</Text>
        </Row>
        <Row style={loginStyles.rowImg}>
          <Image style={loginStyles.image} source={loginImg} />
        </Row>
        <Row style={loginStyles.row}>
          <Field
            conditionalArray={fields}
            onChange={onValueChange}
            // [HONDAIPB-CR] - 25/06/2020 - Honda IT wants pressing Enter in the keyboard, the app should starts logging in.
            // Add new props function onSubmitEditing
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        </Row>
        <Row style={loginStyles.rowSignIn}>
          <Button
            style={loginStyles.btnSignIn}
            iconLeft
            full
            onPress={handleSubmit(onSubmit)}>
            <IcoMoon
              style={loginStyles.btnSignIn.icon}
              size={loginStyles.iconSize.size}
              name="icon-login"
            />
            <Text style={loginStyles.btnSignIn.text}>{t('Sign In')}</Text>
          </Button>
        </Row>
        <Row style={loginStyles.row}>
          <Col size={75}>
            <View style={loginStyles.errorsMessage}>
              {errors.userName && (
                <Text style={loginStyles.errorsMessage.color}>
                  {t(MESSAGE.M001, {
                    fieldName: t('Username'),
                  })}
                </Text>
              )}
              {errors.password && (
                <Text style={loginStyles.errorsMessage.color}>
                  {t(MESSAGE.M001, {
                    fieldName: t('Password'),
                  })}
                </Text>
              )}
              {callSAPErrorsMsg()}
            </View>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
}
export default Login;
