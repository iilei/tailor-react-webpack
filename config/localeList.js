/**
 * Created by iilei on 25.01.17.
 */

import * as fs from 'fs';
import Yaml from 'yamljs';
import { sync as globSync } from 'glob';
import i18n from 'scripts/intl/i18n';

const config = Yaml.load('config/appConfig.yaml');

const remoteLocaleList = JSON.parse(
  fs.readFileSync('build/lang/phraseapp_locales_list.json', 'utf8'),
);


const LocaleFiles = Array.from(globSync('build/lang/remote/*.json'));

function getLocalizedIdentity(translationKey, filename, fallback) {
  let identity = JSON.parse(fs.readFileSync(filename, 'utf8'))[translationKey];
  if (!identity || identity.trim() === '') {
    identity = fallback;
  }

  return (identity);
}

const localeList =
  config
    .locales
    .map(
      (languageCode) => {
        const configLocale = remoteLocaleList.find(locale => (locale.code === languageCode));
        if (!configLocale) {
          throw new Error(
            `Missing File for ${languageCode}! Check your ./config/appConfig.yaml!`,
          );
        }
        const { code, name, rtl } = configLocale;

        const file = (
          LocaleFiles.filter(
            item => (new RegExp(`build/lang/remote/${code}..*.json`)).test(item)))[0];

        const translationKey = i18n.generateMsgKey(code);

        return {
          translationKey,
          localizedIdentity: getLocalizedIdentity(translationKey, file, name),
          code,
          name,
          rtl,
          file: file.replace(/^build\/lang\/remote\//, '/lang/'),
        };
      },
    );

export default localeList;
