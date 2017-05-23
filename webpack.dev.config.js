var webpack = require('webpack');
var path = require('path');
var config = require('./webpack.config');
var packageConfig = require('./package.json');

var port = packageConfig.config.clientPort;

config.output = {
  filename: '[name].js',
  publicPath: `//0.0.0.0:${port}/assets/`,
  path: path.resolve(__dirname, 'client')
};

config.devServer = {
  host: '0.0.0.0',
  port: port
};

config.plugins = config.plugins.concat([

  // Adds webpack HMR support. It act's like livereload,
  // reloading page after webpack rebuilt modules.
  // It also updates stylesheets and inline assets without page reloading.
  new webpack.HotModuleReplacementPlugin()
]);

module.exports = config;
