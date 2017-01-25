import serialize from 'serialize-javascript';
import config from 'config';
import writeFile from 'scripts/writeFile';
import i18n from './i18n';

const localeCodes = config.get('localeList').map(locale => locale.code);

const msgDefinitions = ((locales) => {
  const retVal = locales.map((locale) => {
    const { name } = config.get('localeList').find(item => (item.code === locale));
    return ({
      [i18n.generateMsgKey(locale)]: {
        id: i18n.generateMsgKey(locale),
        defaultMessage: `${name}`,
        description: `language name for locale ${locale} - ${name.toLowerCase()}`,
      },
    });
  });
  return retVal;
})(localeCodes);

function createDataModule(localeData) {
  const serializedLocaleData = serialize(localeData);

  return {
    es6: (
      `/*
+---------------------+
|                     |
|  GENERATED FILE !   |
|                     |
+---------------------+
*/
import { defineMessages } from 'react-intl';
const languageMenu = defineMessages(${serializedLocaleData});
export default languageMenu;
`
    ),
  };
}

function throwIfError(error) {
  if (error) {
    throw error;
  }
}

const allData = createDataModule(Object.assign({}, ...msgDefinitions));
writeFile('src/locale-data/language_menu.js', allData.es6, throwIfError);
