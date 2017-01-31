import ReactDOM from 'react-dom';

/** @jsx App */
import App from './app';

function run() {
  ReactDOM.render(<App />, document.getElementById('app'));
}

// Check if polyfill required
if (!window.Intl) {
  // Webpack parses the inside of require.ensure at build time to know that intl
  // should be bundled separately. You could get the same effect by passing
  // ['intl'] as the first argument.
  require.ensure([], () => {
    // Ensure only makes sure the module has been downloaded and parsed.
    // Now we actually need to run it to install the polyfill.
    require('intl'); // eslint-disable-line

    run();
  });
} else {
  // Polyfill wasn't needed, carry on
  run();
}
