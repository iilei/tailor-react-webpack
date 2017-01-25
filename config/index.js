/**
 * Created by iilei on 22.01.17.
 */

import Yaml from 'yamljs';
import { camelizeKeys } from 'util/camelize';

const appConfig = Yaml.load('config/appConfig.yaml');
const config = camelizeKeys(appConfig);

// console.log(JSON.stringify(config, null, 2));
export default config;
