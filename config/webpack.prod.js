const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const webpack = require("webpack")
const { merge } = require("webpack-merge")

// IMPORT COMMON AND PATHS
const paths = require("./paths")
const common = require("./webpack.common.js")

module.exports = merge(common, {
  mode: "production",
  devtool: false,
  output: {
    path: paths.build,
    publicPath: "/",
    filename: "static/js/[name].[contenthash].bundle.js"
  },
  resolve: {
    // REQUIRED BY REACT PDF
    fallback: {
      process: require.resolve("process/browser"),
      zlib: require.resolve("browserify-zlib"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util"),
      buffer: require.resolve("buffer"),
      asset: require.resolve("assert")
    }
  },
  plugins: [
    // COMPRESS CSS
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash].css",
      chunkFilename: "[id].css"
    }),
    // REQUIRED BY REACT PDF
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: false
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
    // instead of having their own. This also helps with long-term caching, since the chunks will only
    // change when actual code changes, not the webpack runtime.
    splitChunks: {
      chunks: "all",
      maxInitialRequests: 20,
      maxAsyncRequests: 20,
      minSize: 40,
      automaticNameDelimiter: "-",
      cacheGroups: {
        vendors: {
          name: "react",
          test: /[\\/]node_modules[\\/](react|react-dom|redux)[\\/]/,
          chunks: "all"
        },
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    },
    runtimeChunk: {
      name: "runtime"
    }
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
})
