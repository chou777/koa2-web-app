var ExtractTextPlugin = require('extract-text-webpack-plugin');

var extractLess = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = {
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
  module: {
    loaders: [{
      test: /\.html$/,
      use: 'raw-loader'
    }, {
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
    // 打包Css
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function(module, count) {
    //     return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
    //   }
    // })
  ]
};

