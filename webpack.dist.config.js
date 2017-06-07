var webpack = require('webpack');
var path = require('path');
var config = require('./webpack.config');
var fs = require('fs');

// 构建manifest文件
var manifest = function () {
  this.plugin('done', function (stats) {
    var statsJson = stats.toJson();
    var assetsByChunkName = statsJson.assetsByChunkName;
    var modules = statsJson.modules;

    modules.forEach(function (module) {
      if (module.assets && module.assets.length) {
        assetsByChunkName[module.name] = module.assets[0];
      }
    });
    fs.writeFileSync(
      path.join(`${__dirname}/dist`, 'manifest.json'),
      JSON.stringify(assetsByChunkName)
    );
  });
};


config.output = {
  filename: '[name].[chunkhash:8].js',
  chunkFilename: '[name].[chunkhash:8].js',
  path: path.resolve(__dirname, 'dist/client/'),
  publicPath: '/assets/',
};

config.plugins = config.plugins.concat([
  // React 打包必须设定
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  // Reduces bundles total size Minify
  new webpack.optimize.UglifyJsPlugin({
    mangle: {

      // You can specify all variables that should not be mangled.
      // For example if your vendor dependency doesn't use modules
      // and relies on global variables. Most of angular modules relies on
      // angular global variable, so we should keep it unchanged
      except: []
    }
  }),
  manifest
]);

module.exports = config;

