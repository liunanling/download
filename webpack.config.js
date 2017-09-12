var Webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    download: './src/js/download_haochang.js'
  },
  output: {
    path: './dist',
    filename: '[name].js',
    chunkFilename: "[name].js",
    publicPath: './dist/'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
      {test: /\.vue$/, loader: 'vue'},
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.scss$/, loaders: ["style", "css", "sass"]},
      {test: /\.sass$/, loaders: ["style", "css", "sass"]},
      {test: /\.(html|tpl)$/, loader: 'html-loader'},
      {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=51200'}

    ]
  },
  watch: true,
  vue: {
    loaders: {
      js: 'babel'
    }
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    alias: {//注册模块，以后用的时候可以直接requier("模块名")

    }
  }/*,
  plugins: [
    /!*new Webpack.ProvidePlugin({
     Vue: 'vue'
     }),
     new Webpack.optimize.CommonsChunkPlugin('vendor', 'vue.js')*!/
    new Webpack.optimize.UglifyJsPlugin({//压缩,生产环境使用
      output: {
        comments: false,  // remove all comments
      },
      compress: {
        warnings: false
      }
    })
  ]*/
};
