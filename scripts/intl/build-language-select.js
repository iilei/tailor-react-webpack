import serialize from 'serialize-javascript';
import localeList from 'config/localeList';
import writeFile from 'scripts/writeFile';
import intlUtil from './intlUtil';

const localeCodes = localeList.map(locale => locale.code);

const msgDefinitions = ((locales) => {
  const retVal = locales.map((locale) => {
    const curentLocale = localeList.find(item => (item.code === locale));
    const { name, region } = curentLocale;
    const isDefault = curentLocale.default;
    const result = {
      [intlUtil.generateMsgKey(locale)]: {
        id: intlUtil.generateMsgKey(locale),
        defaultMessage: `${name}`,
        description: [
          `
›Switch to ${name} language‹
label used for language selection`,
          ` | ${locale} | ${name} | ${region}`,
          (isDefault ? ' | [ default language ]' : ''),
        ].join(''),
      },
    };
    return result;
  });
  return retVal;
})(localeCodes);

function createDataModule(localeData) {
  const serializedLocaleData = serialize(localeData, { space: 2 });

  return {
    es6: (
      `/*
+---------------------+
|                     |
|  GENERATED FILE !   |
|                     |
+---------------------+
*/

/* eslint-disable */

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
writeFile('src/intl-message/intl-language-select/generated.js', allData.es6, throwIfError);
