const webpack = require('webpack');
const path = require('path');
const debug = require('debug');

const BUILD_DIR = path.resolve(__dirname, 'public/javascripts');
const APP_DIR = path.resolve(__dirname, 'client/app');
const SCSS_DIR = path.resolve(__dirname, 'client/scss');
const SRC = path.resolve(__dirname, 'client');

var config = {
  context: path.join(__dirname, "client"),
  devtool: debug ? "inline-sourcemap" : false,
  entry: APP_DIR + '/index.jsx',
  watch: true,
  output: {
    path: BUILD_DIR,
    filename: "client.min.js"
  },

  module : {
    rules : [
      {
        test: /\.(jpe?g|png|gif)$/i,   //to support eg. background-image property
        use:[
          {
            loader: "file-loader",
            options:{
              name:'[path][name].[ext]',
              outputPath: '../'
            }
          }
        ]
      },{
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,    //to support @font-face rule
        use: [
          {
            loader: "url-loader",
            options:{
              limit:'10000',
              name:'[path][name].[ext]',
              outputPath: '../'
            }
          }
        ]
      }, {
        test: /\.jsx?$/,
        include : APP_DIR,
        exclude: /(node_modules|bower_components)/,
        use:[
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
              plugins: [
                'react-html-attrs',
                ['@babel/plugin-proposal-decorators', { "legacy": true }],
                ['@babel/plugin-proposal-class-properties', { "loose": true }]
              ]
            }
          }
        ]
      },{
        test: /\.scss$/,
        use: ["style-loader","css-loader","sass-loader"]
      }
    ]
  },
  devServer: {
    host: 'localhost', // Defaults to `localhost`
    port: 4000, // Defaults to 8080,
    proxy: {
      '^/api/*': {
        target: 'http://localhost:4000/',
        secure: false
      }
    }
  },

  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
}

module.exports = config;
