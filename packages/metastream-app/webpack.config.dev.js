const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const chalk = require('chalk')
const merge = require('webpack-merge')
const { spawn, execSync } = require('child_process')
const baseConfig = require('./webpack.config.base')

const port = process.env.PORT || 1212
const publicPath = `http://localhost:${port}/dist`

module.exports = merge.smart(baseConfig, {
  // TODO: re-enable this when it isn't 15MB
  devtool: 'none',

  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${port}/`,
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'src/index.tsx')
  ],

  output: {
    publicPath: `http://localhost:${port}/dist/`,
    libraryTarget: 'var'
  },

  module: {
    rules: [
      {
        test: /\.global\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    /**
     * https://webpack.js.org/concepts/hot-module-replacement/
     */
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      DEV: JSON.stringify(true),
      PRODUCTION: JSON.stringify(false),
      FEATURE_SESSION_BROWSER: JSON.stringify(false),
      FEATURE_DISCORD_RP: JSON.stringify(true),
      FEATURE_DISCORD_INVITE: JSON.stringify(true)
    })

    // new webpack.LoaderOptionsPlugin({
    //   debug: true
    // }),
  ],

  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    disableHostCheck: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'dist'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false
    }
  }
})