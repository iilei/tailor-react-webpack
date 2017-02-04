/**
 * Created by iilei on 22.01.17.
 */

import appConfig from './appConfig';
import localeList from './localeList';
import localeMap from './localeMap';

const minimal = { appName: appConfig.appName };

export {
  appConfig,
  localeList,
  localeMap,
  minimal as default,
};
