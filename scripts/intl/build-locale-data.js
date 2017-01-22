import * as fs from 'fs';
import { sync as mkdirpSync } from 'mkdirp';
import extractCLDRData from 'formatjs-extract-cldr-data';
import serialize from 'serialize-javascript';
import config from '../../config';

const cldrData = extractCLDRData({
  locales: config.get('locales'),
  pluralRules: true,
  relativeFields: true,
});

const cldrDataByLocale = new Map(
  Object.keys(cldrData).map(locale => [locale, cldrData[locale]])
);

const cldrDataByLang = [...cldrDataByLocale].reduce((map, [locale, data]) => {
  const langSplit = locale.split('-');
  const [lang] = langSplit;
  const langData = map.get(lang) || [];
  return map.set(lang, langData.concat(data));
}, new Map());

function createDataModule(localeData) {
  const serializedLocaleData = serialize(localeData);

  return {
    es6: (
      `// GENERATED FILE
export default ${serializedLocaleData};
`
    ),

    commonjs: (
      `// GENERATED FILE
module.exports = ${serializedLocaleData};
`
    ),
  };
}

function throwIfError(error) {
  if (error) {
    throw error;
  }
}

// -----------------------------------------------------------------------------

mkdirpSync('src/locale-data/');

const allData = createDataModule([...cldrDataByLocale.values()]);
fs.writeFile('src/locale-data/index.js', allData.es6, throwIfError);

cldrDataByLang.forEach((cldrDataValue, lang) => {
  const data = createDataModule(cldrDataValue);
  fs.writeFile(`src/locale-data/${lang}.js`, data.es6, throwIfError);
});
