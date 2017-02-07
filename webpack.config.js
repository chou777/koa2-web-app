var webpack = require('webpack');
var path = require('path');
var cssnext = require('postcss-cssnext');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ip = require('ip');
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
  dev: `//${ip.address()}:${port}/assets/`
};

var webpackConfig = {
  context: __dirname,
  entry: {
    react: [
      './src/page/react/react.jsx',
      './node_modules/font-awesome/css/font-awesome.css'
    ],
    vendor: [
      'normalize.css',
      './src/css/common.less'
    ]
  },
  output: {
    publicPath: publicPath[assets] || publicPath.dev,
    path: path.resolve(__dirname, `./dist/${staticPrefix}`),
    filename: (assets === 'cdn' || assets === 'dist') ? '[name]-[chunkhash].js' : '[name].js',
    chunkFilename: (assets === 'cdn' || assets === 'dist') ?
      '[name]-[chunkhash].js' : '[name].js'
  },
  resolve: { extensions: ['', '.js', '.jsx'] },
  module: {
    noParse: [],
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css?-autoprefixer!postcss')
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('style', 'css?-autoprefixer!less!postcss')
    }, {
      test: /\.(jpg|jpeg|gif|png)$/i,
      loader: 'file'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    }]
  },
  postcss: function () {
    return [
      cssnext({ browsers: ['> 0%'] })
    ];
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    new ExtractTextPlugin((assets === 'cdn' || assets === 'dist') ?
      '[name]-[chunkhash].css' : '[name].css')
  ],
  devServer: {
    host: '0.0.0.0',
    port: port
  }
};

// generate manifest.json
if (assets === 'cdn' || assets === 'dist') {
  webpackConfig.plugins.push(function () {
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
        path.join(__dirname, 'manifest.json'),
        JSON.stringify(assetsByChunkName)
      );
    });
  });

  webpackConfig.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }));
}

module.exports = webpackConfig;
