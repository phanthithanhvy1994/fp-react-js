import {FieldConstant} from '../../constants/constants';
import loginStyles from './Login.style';
import {SAPLanguage} from '../../constants/constants';

export const loginFields = [
  {
    id: 'login_userName',
    fieldName: 'userName',
    iconName: 'icon-user',
    placeHolderText: 'Username',
    isIcoMoon: true,
    fieldType: FieldConstant.type.TEXT,
    customStyle: {
      fieldItem: loginStyles.fieldUsername,
      fieldContainer: loginStyles.fieldContainer,
      labelContainer: loginStyles.labelContainer,
      iconItem: loginStyles.iconItem,
    },
  },
  {
    id: 'login_password',
    fieldName: 'password',
    placeHolderText: 'Password',
    fieldType: FieldConstant.type.PASSWORD,
    secureTextEntry: false,
  },
];

export const settingField = [
  {
    id: 'login_settings',
    fieldName: 'url',
    label: 'URL',
    placeHolderText: 'URL',
    fieldType: FieldConstant.type.TEXT,
    require: true,
    customStyle: {
      fieldItem: loginStyles.fieldSetting,
      fieldContainer: loginStyles.settingfieldContainer,
      labelContainer: loginStyles.labelContainer,
      iconItem: loginStyles.iconItem,
    },
  },
  {
    id: 'login_clientCode',
    fieldName: 'clientCode',
    label: 'SAP Client',
    placeHolderText: 'Code',
    keyboardType: 'decimal-pad',
    require: true,
    fieldType: FieldConstant.type.TEXT,
    customStyle: {
      fieldItem: loginStyles.fieldSetting,
      fieldContainer: loginStyles.configFieldContainer,
      labelContainer: loginStyles.labelContainer,
      iconItem: loginStyles.iconItem,
    },
  },
  {
    id: 'login_clientLanguage',
    fieldName: 'clientLanguage',
    label: 'Language',
    placeHolderText: 'Language',
    maxLength: 2,
    value: SAPLanguage.thailan,
    fieldType: FieldConstant.type.SELECT,
    data: [
      {
        display: SAPLanguage.thailan,
        value: SAPLanguage.thailan,
      },
      {
        display: SAPLanguage.english,
        value: SAPLanguage.english,
      },
    ],
    customStyle: {
      selectedItem: loginStyles.fieldLanguage,
      fieldContainer: loginStyles.languageContainer,
      labelContainer: loginStyles.labelContainer,
    },
  },
];

export const validationRules = [
  {
    name: 'userName',
    rule: {
      required: 'Username is required.',
    },
  },
  {
    name: 'password',
    rule: {
      required: 'Password is required.',
    },
  },
];
