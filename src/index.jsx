import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';

import App from './app';

const { locales } = appConfig;
const APP_NAME = appConfig.__appName;
const IS_DEV = process.env.IS_DEV;
const Intl = window ? window.intl : global.intl;

const localeMainTags = locales.map(locale => locale.split('-')[0]);

localeMainTags.forEach((tag) => {
  try {
    // -- Dynamic Import - tamed via webpack.config, so only desired languages are loaded
    // eslint-disable-next-line import/no-dynamic-require, global-require
    addLocaleData(...require(`react-intl/locale-data/${tag}`));
  } catch (e) {
    // logging
    if (IS_DEV) {
      // eslint-disable-next-line
      console.warn(`⚠️️ Unresolved react-intl/locale-data/${tag} !`);
    }
  }
});

if (window) {
  window.React = React;
  window[APP_NAME] = window[APP_NAME] || {};

  if (IS_DEV) {
    window[APP_NAME].appConfig = appConfig;
    window[APP_NAME]['process.env'] = process.env;

    // eslint-disable-next-line
    console.log(`For easier development, attached the appConfig to window.${APP_NAME}.appConfig`);
  }
}

function run() {
  render(<App />, document.getElementById('app'));
}

if (!Intl) {
  require.ensure(['intl'], (require) => {
    require('intl');
    run();
  });
} else {
  run();
}
