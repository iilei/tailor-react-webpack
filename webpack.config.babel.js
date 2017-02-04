// based on https://github.com/frux/trowel/tree/master/webpack

import parameterize from 'parameterize';
import appConfig from './config/appConfig';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
// const AssetsPlugin = require('assets-webpack-plugin');
// const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postCss = require('postcss-cssnext');

const env = process.env.NODE_ENV;
const IS_PROD = ['prod', 'production'].includes(env.toLowerCase());
const IS_DEV = !IS_PROD;
const RGXP_VENDOR_PCKG = /node_modules/;
const RGXP_VENDOR_LOCALES = /(?:moment[\\/]locale)|(?:intl[\\/]locale-data)$/;

const MIN_CHUNK_SIZE = 100000;
const APP_MAIN_CHUNK_NAME = parameterize(appConfig.appName);

/**
 * Determine which locales moment.js should actually load
 */
let localePatterns = appConfig.locales.map(
  // Regex matching 'en' or 'en-US' and 'de' or 'de-DE' -- part after the '-' is optional
  locale => locale.toLowerCase().replace(/-([a-z]+)$/, '(?:-$1)?'),
);
localePatterns = localePatterns.map(pattern => `(?:${pattern})`);

const REGEX_DESIRED_LANGUAGES = new RegExp(`^\\./(${localePatterns.join('|')})$`, 'i');

// eslint-disable-next-line
console.info(
  `
ContextReplacementPlugin is configured to limit moment.js locales matching

  RegExp(${REGEX_DESIRED_LANGUAGES})

`,
);

const mainEntrypoint = [
  IS_DEV ? 'react-hot-loader/patch' : null,
  // activate HMR for React

  // IS_DEV ? 'webpack-hot-middleware/client?http://localhost:8080' : null,
  // obsolete ? see http://stackoverflow.com/questions/41342144/webpack-hmr-webpack-hmr-404-not-found#answer-41483088
  // // bundle the client for webpack-dev-server
  // // and connect to the provided endpoint

  IS_DEV ? 'webpack/hot/only-dev-server' : null,
  // bundle the client for hot reloading
  // only- means to only hot reload for successful updates

  './src/index',
  // finally, the main entry point,
].filter(file => !!file); // get rid of `null` entries, keep truthies

let stylesLoader = [
  'style-loader',
  'css-loader',
  { loader: 'postcss-loader', options: { plugins: () => [postCss] } },
  'sass-loader',
];

// if production wrap styles in ExtractTextPlugin
if (IS_PROD) {
  const fallbackLoader = stylesLoader.shift();
  const loader = stylesLoader;
  stylesLoader = ExtractTextPlugin.extract({ fallbackLoader, loader });
}

const config = {
  name: 'client',
  entry: {
    [APP_MAIN_CHUNK_NAME]: mainEntrypoint,
  },
  output: {
    path: path.join(__dirname, './static'),
    filename: (IS_PROD ? '[name]-[chunkhash:6].js' : '[name].[id].js'),
    publicPath: '',
    libraryTarget: 'this',
    library: '__init__',
    devtoolModuleFilenameTemplate: '/[resource-path]',
  },
  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: path.join(__dirname, 'static'),
    // match the output path

    publicPath: '/',
    // match the output `publicPath`

    // compress: true,
    // enable gzip
    // clientLogLevel: 'info' // none, error, warning or info,
  },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader' },
      { test: require.resolve('react'), loader: 'expose-loader?React' },
      { test: /\.s?css$/, loader: stylesLoader },
      { test: /\.(jpg|gif|png|eot|otf|woff2?|ttf)$/, loader: 'file-loader' },
      {
        test: /\.svg/,
        use: [
          { loader: 'svg-url-loader', options: { dataUrlLimit: 1024 } },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      filename: 'index.html',
      excludeAssets: ['intl'],
    }),
    new HtmlWebpackExcludeAssetsPlugin(),

    IS_DEV ? new webpack.HotModuleReplacementPlugin() : null,
    // enable HMR globally

    IS_DEV ? new webpack.NamedModulesPlugin() : null,
    // prints more readable module names in the browser console on HMR updates

    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: MIN_CHUNK_SIZE }),
    IS_PROD ? new webpack.optimize.AggressiveMergingPlugin() : null,

    new webpack.ContextReplacementPlugin(RGXP_VENDOR_LOCALES, REGEX_DESIRED_LANGUAGES),

    // new ChunkManifestPlugin({ filename: 'manifest.json', manifestVariable: 'webpackManifest' }),

    new webpack.optimize.CommonsChunkPlugin({
      name: APP_MAIN_CHUNK_NAME,
      filename: IS_PROD ? '[name]-[chunkhash:6].js' : '[name].js',
    }),

    new webpack.optimize.CommonsChunkPlugin({
      // Extract all 3rd party modules into a separate 'vendor' chunk
      // exclude locales
      name: 'vendor',
      minChunks: ({ resource }) => (
        RGXP_VENDOR_PCKG.test(resource) && !RGXP_VENDOR_LOCALES.test(resource)
      ),
    }),

    new webpack.optimize.CommonsChunkPlugin({
      // Extract all locale modules into a separate 'locales' chunk
      name: 'locales',
      minChunks: ({ resource }) => RGXP_VENDOR_LOCALES.test(resource),
    }),

    // new webpack.optimize.CommonsChunkPlugin('manifest'),
    new WebpackMd5Hash(),
    new ExtractTextPlugin((IS_PROD ? '[name]-[hash:6].css' : '[name].css')),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) }),
    new webpack.DefinePlugin({
      appConfig: JSON.stringify(appConfig),
      // localeMap: JSON.stringify(localeMap),
      'process.env': JSON.stringify({ IS_DEV, IS_PROD }),
    }),

    new ScriptExtHtmlWebpackPlugin({
      // inline: 'manifest.js',
      defaultAttribute: 'defer',
      inline: ['locales'],
    }),

    // Need this plugin for deterministic hashing
    // until this issue is resolved: https://github.com/webpack/webpack/issues/1315
    // for more info: https://webpack.js.org/how-to/cache/
    new WebpackMd5Hash(),


  ].filter(plugin => !!plugin), // drop *null* entries
  devtool: IS_PROD ? 'source-maps' : 'cheap-module-eval-source-map',

};

module.exports = config;
