// based on https://github.com/frux/trowel/tree/master/webpack

import appConfig from './config/appConfig';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postCss = require('postcss-cssnext');

const env = process.env.NODE_ENV || 'prod';
const IS_PROD = ['prod', 'production'].includes(env.toLowerCase());
const IS_DEV = !IS_PROD;

const MIN_CHUNK_SIZE = 100000;
const chunks = {
  main: appConfig.appName,
};

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

  './src/app',
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
    [chunks.main]: mainEntrypoint,
  },
  output: {
    path: path.join(__dirname, './static'),
    filename: (IS_PROD ? '[name].[id].[chunkhash:6].js' : '[name].[id].js'),
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
    new HtmlWebpackPlugin({ template: 'src/index.html', inject: 'body', filename: 'index.html' }),
    IS_DEV ? new webpack.HotModuleReplacementPlugin() : null,
    // enable HMR globally

    IS_DEV ? new webpack.NamedModulesPlugin() : null,
    // prints more readable module names in the browser console on HMR updates

    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: MIN_CHUNK_SIZE }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, REGEX_DESIRED_LANGUAGES),
    new ChunkManifestPlugin({ filename: 'manifest.json', manifestVariable: 'webpackManifest' }),
    new webpack.optimize.CommonsChunkPlugin({
      name: chunks.main,
      filename: IS_PROD ? '[name].[id].[chunkhash:6].js' : '[name].js',
    }),
    new ExtractTextPlugin((IS_PROD ? '[name].[id].[hash:6].css' : '[name].css')),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) }),
    new webpack.DefinePlugin({
      appConfig: JSON.stringify(appConfig),
      // localeMap: JSON.stringify(localeMap),
      'process.env': JSON.stringify({ IS_DEV, IS_PROD }),
    }),
  ].filter(plugin => !!plugin), // drop *null* entries
  devtool: IS_PROD ? 'source-maps' : 'eval-source-map',
};

module.exports = config;
