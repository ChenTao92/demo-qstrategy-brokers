/*
* @Author: taochen
* @Date:   2016-11-22 11:59:17
* @Last Modified by:   taochen
* @Last Modified time: 2016-11-25 16:04:49
*/

var path = require("path")
var webpack = require("webpack")

var env = process.env.NODE_ENV || "dev"

var devPlugins = []
var productionPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  })
]

module.exports = {
  entry: {
    app: "./src/main.js",
    style: "./src/style.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  resolve: {
    root: [
      path.join(__dirname, "src"),
      __dirname,
    ],
    extensions: ["", ".js", ".jsx", ".styl"],
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        loader: "style!css!stylus",
      },
      {
        test: /\.css$/,
        loader: "style!css",
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: "json-loader",
      },
      {
        test: /\.(svg|eot|woff2|woff|ttf|jpg|png|jpeg)(\?.*)?$/,
        loader: "url?limit=10000&name=assets/[hash].[ext]",
      },
    ],
  },
  plugins: env === "dev" ? devPlugins : productionPlugins,
}
