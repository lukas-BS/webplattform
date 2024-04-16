const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BundleTracker = require('webpack-bundle-tracker');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');


const devMode = process.env.NODE_ENV !== 'production';
const hotReload = process.env.HOT_RELOAD === '1';

const vueRule = {
  test: /\.vue$/,
  use: 'vue-loader',
  include: path.resolve('./static/src/js'),
  exclude: /node_modules/
};

const styleRule = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { sourceMap: true } },
    { loader: 'postcss-loader', options: { plugins: () => [autoprefixer({ browsers: ['last 2 versions'] })] } },
    'sass-loader'
  ]
};

const jsRule = {
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-proposal-object-rest-spread']
    }
  },
  include: path.resolve('./static/src/js'),
  exclude: /node_modules/
};

const assetRule = {
  test: /.(jpg|png|woff(2)?|eot|gif|ttf|woff|woff2|svg)$/,
  type: 'asset/resource'
};

const plugins = [
  new BundleTracker({ filename: 'webpack-stats.json', path: path.join(__dirname, '/static/dist/') }),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),
  new VueLoaderPlugin(),
  new MiniCssExtractPlugin({
    filename: devMode ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
  }),
  new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
  new CleanWebpackPlugin(),
  new LodashModuleReplacementPlugin({
    'collections': true,
    'paths': true
  })
];

if (devMode) {
  styleRule.use = ['css-hot-loader', ...styleRule.use];
}


module.exports = {
  entry: {
    main_dll: path.join(__dirname, './static/src/js/index_dll.js'),
    main_dlt: path.join(__dirname, './static/src/js/index_dlt.js'),
    flower: path.join(__dirname, './static/src/js/django/flower.js'),
    filter: path.join(__dirname, './static/src/js/apps/filter.js')
  },
  output: {
    path: path.resolve(__dirname, './static/dist/'),
    filename: '[name].[contenthash].bundle.js',
    // publicPath: hotReload ? 'http://localhost:8080/' : ''
  },
  devtool: devMode ? 'eval-cheap-source-map' : 'source-map',
  devServer: {
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    devMiddleware: {
      writeToDisk: true
    }
  },
  module: { rules: [vueRule, jsRule, styleRule, assetRule] },
  // externals: { jquery: 'jQuery', Sentry: 'Sentry' },
  plugins,
  optimization: {
    // minimizer: [
    //   new UglifyJsPlugin({
    //     cache: true,
    //     parallel: true,
    //     sourceMap: true // set to true if you want JS source maps
    //   }),
    //   new OptimizeCSSAssetsPlugin({})
    // ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
        },
      }
    }
  },
};