import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';

import App from './app';

const { locales } = appConfig;
const localeMainTags = locales.map(locale => locale.split('-')[0]);

// dynamic requires - restricted to locales actually desired via webpack.config
localeMainTags.forEach((tag) => {
  addLocaleData(...require(`react-intl/locale-data/${tag}`));
});


const APP_NAME = appConfig.__appName;
const IS_DEV = process.env.IS_DEV;

if (window) {
  window.React = React;
  window[APP_NAME] = window[APP_NAME] || {};

  if (IS_DEV) {
    window[APP_NAME].appConfig = appConfig;
    window[APP_NAME]['process.env'] = process.env;

    // eslint-disable-next-line
    console.log('For easier developmnet, attached the appConfig to' +
      `window.${APP_NAME}.appConfig`);
  }
}

function run() {
  render(
    <App />,
    document.getElementById('app'));
}

// Check if polyfill required
if (!window.Intl) {
  // Webpack parses the inside of require.ensure at build time to know that intl
  // should be bundled separately. You could get the same effect by passing
  // ['intl'] as the first argument.
  require.ensure(['intl'], () => {
    // Ensure only makes sure the module has been downloaded and parsed.
    // Now we actually need to run it to install the polyfill.
    require('intl'); // eslint-disable-line

    run();
  });
} else {
  // Polyfill wasn't needed, carry on
  run();
}
