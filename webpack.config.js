const kit = require('nokit');
const webpack = require('webpack');
const HappyPack = require('happypack');
const CleanupPlugin = require('clean-webpack-plugin');


const { join } = kit.path;
const BUILD_PATH = join(__dirname, 'build');
const SRC_PATH = join(__dirname, 'src');
const NODE_MODULES_PATH = join(__dirname, 'node_modules');

const plugins = [
  new CleanupPlugin(BUILD_PATH),

  new webpack.DefinePlugin({
    __DEV__: kit.isDevelopment(),
  }),

  new webpack.optimize.ModuleConcatenationPlugin(),

  new webpack.HashedModuleIdsPlugin(),

  new HappyPack({
    id: 'js',
    threads: 4,
    loaders: [
      {
        path: 'babel-loader',
        query: {
          presets: [
            ['env', {
              targets: {
                browsers: ['last 3 versions'],
              },
            }],
          ],
        },
      },
    ],
  }),
];

const config = {
  entry: {
    index: 'index.js',
  },

  output: {
    path: BUILD_PATH,
    filename: '[name].js',
  },

  resolve: {
    modules: [
      __dirname,
      SRC_PATH,
      NODE_MODULES_PATH,
    ],
    extensions: ['.js'],
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'happypack/loader',
        options: {
          id: 'js',
        },
        exclude: /(node_modules|bower_components)/,
        include: SRC_PATH,
      },
    ],
  },

  stats: {
    hash: false,
    chunks: false,
    chunkModules: false,
    children: false,
  },

  plugins,
};

if (kit.isProduction()) {
  config.devtool = 'source-map';

  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    sourceMap: true,
    compress: {
      warnings: false,
    },
  }));
}

module.exports = config;
