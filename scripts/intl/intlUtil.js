import unifyLocaleCode from 'util/unifyLocaleCode';
import config from 'config/appConfig';

const intlUtil = {
  generateMsgKey: string => (`${config.localeTranslationKeyPrefix}.${unifyLocaleCode(string)}`),
};

export { intlUtil as default };
