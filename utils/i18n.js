import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import XHR from 'i18next-xhr-backend';
import DeviceInfo from 'react-native-device-info';

import en from '../locales/en.json';
import th from '../locales/th.json';

const languageDetector = {
  type: 'languageDetector',
  detect: () => DeviceInfo.getDeviceLocale(),
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .use(languageDetector) // detect user language
  .use(XHR) // load translation using xhr
  .init({
    debug: false, // Console log
    lng: 'en',
    fallbackLng: 'en', // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    resources: {
      en,
      th,
    },
    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',
  });
i18n.fallbacks = true;

export default i18n;
