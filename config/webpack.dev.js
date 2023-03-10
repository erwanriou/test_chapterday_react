const paths = require("./paths")

const { HotModuleReplacementPlugin } = require("webpack")
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")

let proxy = {}

if (process.env.REACT_APP_LOCAL_DEV) {
  proxy = {
    "/auth/**": {
      target: "https://architects.archsplace-staging.com/",
      secure: false,
      changeOrigin: true
    },
    "/api/**": {
      target: "https://architects.archsplace-staging.com/",
      secure: false,
      changeOrigin: true
    }
  }
}

const devConfig = {
  mode: "development",
  devtool: "inline-source-map",
  stats: "errors-only",
  output: {
    filename: "[name].bundle.js",
    publicPath: "/"
  },
  devServer: {
    allowedHosts: [".archsplace.dev"], // NEEDED FOR DOCKERIZATION
    historyApiFallback: true,
    static: paths.build,
    compress: true,
    hot: true,
    proxy,
    port: 3000,
    // REQUIRED FOR DOCKER CONTAINER LIVE RELOADING
    client: {
      webSocketURL: { hostname: undefined, pathname: undefined, port: "0" }
    }
  },
  plugins: [
    // HOT RELOADING
    new HotModuleReplacementPlugin()
  ]
}

module.exports = merge(common, devConfig)
