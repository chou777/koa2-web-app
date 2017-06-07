/**
 * @author zhouziyao@meituan.com
 * @description Webpakc Config use for dev and dist
 */

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var path = require('path');
var extractLess = new ExtractTextPlugin({
  filename: process.env.NODE_ENV === 'development' ? '[name].css' : '[name].[chunkhash:8].css',
  disable: false
});

var postCssOptions = {
  plugins: () => [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ]
};

module.exports = {
  devtool: 'nosources-source-map',
  entry: {
    images: [
      './client/common/js/images.js',
    ],
    react: [
      './client/page/react/react.jsx',
    ],
    page1: [
      './client/page/page1/page1.jsx',
    ],
    vendor: [
      './node_modules/normalize.css/normalize.css',
      './client/css/common.less'
    ]
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }]
    }, {
      test: /\.less$/,
      use: extractLess.extract({
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }, {
          loader: 'postcss-loader',
          options: postCssOptions
        }, {
          loader: 'less-loader'
        }],
        // use style-loader in development
        fallback: 'style-loader'
      })
    }, {
      test: /\.css$/,
      use: extractLess.extract({
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }, {
          loader: 'postcss-loader',
          options: postCssOptions

        }],
        // use style-loader in development
        fallback: 'style-loader'
      })
    }, {
      test: /\.(jpg|jpeg|gif|png)$/i,
      use: [
        { loader: 'file-loader' }
      ]
    }]
  },
  plugins: [
    extractLess,
    // 提取公共模块。
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
      }
    })
  ]
};

