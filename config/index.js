/**
 * Created by iilei on 22.01.17.
 */

import Yaml from 'yamljs';
import { camelizeKeys } from 'util/camelize';

const appConfig = Yaml.load('config/appConfig.yaml');
const config = camelizeKeys(appConfig);

export default config;
