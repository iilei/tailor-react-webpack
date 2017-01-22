import unifyLocaleCode from 'util/unifyLocaleCode';
import config from 'config';

const i18n = {
  generateMsgKey: string => (`${config.localeTranslationKeyPrefix}.${unifyLocaleCode(string)}`),
  localeCodes: config.locales,
};

export default i18n;
