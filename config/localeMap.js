/**
 * Created by iilei on 25.01.17.
 */

import * as fs from 'fs';
import { sync as globSync } from 'glob';
import localeList from 'config/localeList';
import intlUtil from '../scripts/intl/intlUtil';

const remoteLocaleList = JSON.parse(
  fs.readFileSync('build/i18n/metadata.json', 'utf8'),
);

const LocaleFiles = Array.from(globSync('build/i18n/remote/*.json'));

function getLocalizedIdentity(translationKey, filename, fallback) {
  let identity = JSON.parse(fs.readFileSync(filename, 'utf8'))[translationKey];
  if (!identity || identity.trim() === '') {
    identity = fallback;
  }

  return (identity);
}

const localeMap =
  localeList
    .map(
      (language) => {
        const { code, name } = language;
        const configLocale = remoteLocaleList.find(locale => (locale.code === code));
        if (!configLocale) {
          throw new Error(
            `Missing File for ${code}! Check your ./config/appConfig.yaml!`,
          );
        }

        const path = (
          LocaleFiles.filter(
            item => (new RegExp(`build/i18n/remote/${code}..*.json`)).test(item)))[0];

        if (!path) {
          throw new Error(
            `No file found matching build/i18n/remote/${code}..*.json! Try \`npm run intl:pull\``,
          );
        }

        const translationKey = intlUtil.generateMsgKey(code);

        return {
          ...language,
          translationKey,
          localizedName: getLocalizedIdentity(translationKey, path, name),
          file: path.match(/[^/]+$/, '')[0],
        };
      },
    );

export default localeMap;
