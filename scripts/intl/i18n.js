import unifyLocaleCode from 'util/unifyLocaleCode';
import config from 'config/appConfig';

const i18n = {
  generateMsgKey: string => (`${config.localeTranslationKeyPrefix}.${unifyLocaleCode(string)}`),
};

export { i18n as default };
