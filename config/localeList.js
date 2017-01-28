/**
 * Created by iilei on 25.01.17.
 */

import * as fs from 'fs';
import Yaml from 'yamljs';
import tags from 'language-tags'; // RFC-5646 => de-DE <=> 'German'
import { camelizeKeys } from 'util/camelize';

const appConfig = Yaml.load('config/appConfig.yaml');
const config = camelizeKeys(appConfig);

const localeMetadata = JSON.parse(
  fs.readFileSync('build/i18n/metadata.json', 'utf8'),
);

function languageName(code) {
  const language = tags.language(code.split('-')[0]).descriptions()[0];
  return `${language}`;
}

function languageRegion(code) {
  const region = tags.region(code.split('-').pop()).descriptions()[0];
  return `${region}`;
}

const localeList = localeMetadata.map(lc => ({
  code: lc.code,
  name: languageName(lc.code),
  region: languageRegion(lc.code),
  rtl: lc.rtl,
  source_locale: lc.source_locale,
  default: [lc.code, lc.name].includes(config.defaultLocale),
}));

// apply sorting as defined in appConfig.yaml
const sortedLocaleList = config.locales.map(
  locale => localeList.find(localeCode => localeCode.code === locale),
);

export default sortedLocaleList;
