import { sync as mkdirpSync } from 'mkdirp';
import extractCLDRData from 'formatjs-extract-cldr-data';
import serialize from 'serialize-javascript';
import writeFile from 'scripts/writeFile';
import config from 'config';

// const DEFAULT_LOCALE = (config.defaultLocale && `${config.defaultLocale}`) || 'de-DE';

const cldrData = extractCLDRData({
  locales: config.locales,
  pluralRules: true,
  relativeFields: true,
});


const cldrDataByLocale = new Map(
  Object.keys(cldrData).map(locale => [locale, cldrData[locale]]),
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
      `/*
+---------------------+
|                     |
|  GENERATED FILE !   |
|                     |
+---------------------+
*/
export default ${serializedLocaleData};
`
    ),

    commonjs: (
      `/*
+---------------------+
|                     |
|  GENERATED FILE !   |
|                     |
+---------------------+
*/
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

mkdirpSync('locale-data/');
// const defaultData = createDataModule(cldrDataByLocale.get(DEFAULT_LOCALE));
// writeFile(`src/${DEFAULT_LOCALE}.js`, defaultData);

const allData = createDataModule([...cldrDataByLocale.values()]);
writeFile('locale-data/index.js', allData.es6, throwIfError);

cldrDataByLang.forEach((cldrDataValue, lang) => {
  const data = createDataModule(cldrDataValue);
  writeFile(`locale-data/${lang}.js`, data.es6, throwIfError);
});
