/**
 * Created by iilei on 22.01.17.
 */

import Yaml from 'yamljs';
import { camelizeKeys } from 'util/camelize';
import changeCase from 'change-case';
import parameterize from 'parameterize';

const pjson = require('../package.json');

const appConfig = camelizeKeys(Yaml.load('./config/appConfig.yaml'));

if (appConfig.__appName) {
  throw new Error('appCongig sets reserved key "__appName"!');
}

if (!appConfig.appName) {
  throw new Error(`
appCongig doesn't provide "app_name"!
Maybe set it to ${changeCase.noCase(parameterize(pjson.name))}? `);
}

appConfig.__appName = changeCase.camelCase(parameterize(appConfig.appName));

export default appConfig;
