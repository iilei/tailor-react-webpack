/**
 * Created by iilei on 22.01.17.
 */

import Yaml from 'yamljs';
import { camelizeKeys } from 'util/camelize';

const appConfig = camelizeKeys(Yaml.load('./config/appConfig.yaml'));

export default appConfig;
