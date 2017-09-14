var path = require("path");
var webpack = require("webpack");
var curVersion = JSON.stringify(require("./package.json").version)
var curYear = new Date().getFullYear()
var author = require("./package.json").author
var contributors = require("./package.json").contributors
var getBanner = function(){
    return `
    Route360° JavaScript API ${curVersion}, a JS library for leaflet & google maps. http://route360.net
    (c) ${curYear} ${contributors.join(', ')}
    (c) ${curYear} ${author}
    `
}

var config = {
    entry: {
      'r360': './src/index.ts',
      'r360.min': './src/index.ts'
    },
    output: {
      path: path.resolve(__dirname, '_bundles'),
      filename: '[name].js',
      libraryTarget: 'umd',
      library: 'r360',
      umdNamedDefine: true
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: true,
        include: /\.min\.js$/,
      }),
      new webpack.BannerPlugin({
        banner: getBanner()
      })
    ],
    module: {
      loaders: [{
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        query: {
          declaration: false,
        }
      }]
    }
  };

  module.exports = config;