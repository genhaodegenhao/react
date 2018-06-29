import config from 'config';
import chalk from 'chalk';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';
// import AutoDllPlugin from 'autodll-webpack-plugin';

import webpackConfig from './webpack.base.conf';

let PUBLIC_PATH;

if (process.env.NODE_ENV === 'development') {
  PUBLIC_PATH = ''
} else {
  PUBLIC_PATH = config.get('publicPath');
}

const theme = require('../../package.json').theme;
const APP_ENTRY_POINT = config.get('appEntry');
const IS_DEBUG = config.get('debug') || false;
const BUNDLE_LIST = config.get('bundleConfig') || [];
const TEMPLATE_PAGE = config.get('templatePage') || 'public/index.html';

let webpackDevOutput;

let entryConfig = {};

entryConfig = Object.assign(entryConfig, BUNDLE_LIST);

let vendorList = config.get('vendorList') || [];

if (IS_DEBUG) {
  vendorList.unshift('eruda');
}

// Config for Javascript file

Object.entries(APP_ENTRY_POINT).forEach(item => {
  Object.assign(entryConfig, {
    [`assets/js/${item[0]}`]: [
      'babel-polyfill',
      'webpack-hot-middleware/client?reload=true',
      'webpack/hot/only-dev-server',
      item[1],
    ]
  });
});

//Config for output

webpackDevOutput = {
  publicPath: `${PUBLIC_PATH}/`,
  filename: '[name].[chunkhash].js',
  chunkFilename: "assets/js/[id].[chunkhash].js",
};


webpackConfig.output = Object.assign(webpackConfig.output, webpackDevOutput);

webpackConfig.plugins.push(
  new webpack.LoaderOptionsPlugin({
    debug: true
  }),

  new webpack.HotModuleReplacementPlugin(),
  new StyleLintPlugin({
      context: "src",
      configFile: '.stylelintrc.js',
      files: '**/*.less',
      failOnError: false,
      quiet: false,
      syntax: 'less'
    }
  ),
  // new AutoDllPlugin({
  //   inject: true,
  //   filename: '[name].dll.js',
  //   path: './assets/js',
  //   entry: {
  //     vendor: vendorList
  //   }
  // }),
);

webpackConfig.module.rules = webpackConfig.module.rules.concat(
  {
    test: /\.css|less$/,
    exclude: [path.resolve('node_modules'), path.resolve('lib/assets/css/mod_css')],
    use: [
      {
        loader: "style-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]"
      },
      {
        loader: "css-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]"
      },
      {
        loader: 'postcss-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]',
        options: {
          sourceMap: true,
          config: {
            path: 'build/config/postcss.config.js'
          }
        }
      },
      {
        loader: "less-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]",
      },
    ],
  },
  {
    test: /\.css|less$/,
    include: [path.resolve('node_modules'), path.resolve('lib/assets/css/mod_css')],
    use: [
      {
        loader: "style-loader?sourceMap=true"
      },
      {
        loader: "css-loader?sourceMap=true"
      },
      {
        loader: 'postcss-loader?sourceMap=true',
        options: {
          sourceMap: true,
          config: {
            path: 'build/config/postcss.config.js'
          }
        }
      },
      {
        loader: "less-loader?sourceMap=true",
        options: {modifyVars: theme}
      }
    ],
  },
);

const serverIndex = config.get('serverIndex');
const opnHost = `http://${config.get('host')}:${config.get('port')}`;

Object.keys(APP_ENTRY_POINT).forEach((name,index)=> {
  let chunks = [];
  if(index === 0) {
    webpackConfig.plugins.push(
      new OpenBrowserPlugin({
        url: `${opnHost}/${serverIndex ? serverIndex : `${name}.html`}`,
      }),
    );
  }
  Object.keys(BUNDLE_LIST).forEach((chunk) => {
    chunks.push(chunk);
  });
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: TEMPLATE_PAGE,
      inject: 'body',
      chunks: [`assets/js/${name}`, 'vendors', ...chunks],
    }),
  );
});

webpackConfig.devtool = 'cheap-module-eval-source-map';

webpackConfig.entry = entryConfig;

export default webpackConfig;
