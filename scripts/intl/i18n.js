import unifyLocaleCode from 'util/unifyLocaleCode';
import config from 'config/index';

const i18n = {
  generateMsgKey: string => (`${config.localeTranslationKeyPrefix}.${unifyLocaleCode(string)}`),
};

export default i18n;
