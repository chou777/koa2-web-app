var webpack = require('webpack');
var path = require('path');
var cssnext = require('postcss-cssnext');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs');
var packageConfig = require('./libs/packageConfig');
var config = require('./config');

var port = packageConfig.staticPort;
var staticPrefix = packageConfig.staticPrefix;
var assets = config('assets');
var cdnPath = '';

var publicPath = {
  cdn: `//${cdnPath}/${staticPrefix}/`,
  dist: `/assets/${staticPrefix}/`,
  dev: `//0.0.0.0:${port}/assets/`
};

const extractLess = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development'
});

var webpackConfig = {
  devtool: 'source-map',
  entry: {
    react: [
      './src/page/react/react.jsx',
      './src/page/react/react.less'
    ],
    vendor: [
      './src/css/common.less'
    ]
  },
  output: {
    filename: '[name].js',
    publicPath: publicPath[assets] || publicPath.dev,
    path: path.resolve(__dirname, 'client')
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
          loader: 'css-loader'
        }, {
          loader: 'less-loader'
        }],
        // use style-loader in development
        fallback: 'style-loader'
      })
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(jpg|jpeg|gif|png)$/i,
      use: [
        { loader: 'file-loader' }
      ]
    }]
  },
  plugins: [
    extractLess,
    // 全都打到Build vendor中只有一个css
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module, count) {
    //     return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
    //   }
    // })
  ],
  devServer: {
    host: '0.0.0.0',
    port: port
  }
};


// generate manifest.json
// if (assets === 'cdn' || assets === 'dist') {
//   webpackConfig.plugins.push(function () {
//     this.plugin('done', function (stats) {
//       var statsJson = stats.toJson();
//       var assetsByChunkName = statsJson.assetsByChunkName;
//       var modules = statsJson.modules;

//       modules.forEach(function (module) {
//         if (module.assets && module.assets.length) {
//           assetsByChunkName[module.name] = module.assets[0];
//         }
//       });

//       fs.writeFileSync(
//         path.join(__dirname, 'manifest.json'),
//         JSON.stringify(assetsByChunkName)
//       );
//     });
//   });

//   webpackConfig.plugins.push(new webpack.DefinePlugin({
//     'process.env': {
//       NODE_ENV: JSON.stringify('production')
//     }
//   }));
// }

module.exports = webpackConfig;

