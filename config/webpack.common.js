const path = require("path")
const dotenv = require("dotenv")
const { DefinePlugin } = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

// IMPORT PATHS
const paths = require("./paths")

module.exports = {
  // REACT ENTRY POINT
  entry: [paths.src + "/index.js"],

  // OUTPUT POINT
  output: {
    path: paths.build,
    filename: "[name].[contenthash].bundle.js",
    publicPath: "auto"
  },

  // CUSTOM PLUGINS
  plugins: [
    // CLEAN BUILD AND DIST
    new CleanWebpackPlugin(),
    // COPY FOR BUILD PURPOSE
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public + "/assets",
          to: "assets",
          globOptions: {
            ignore: ["*.DS_Store"]
          }
        },
        {
          from: paths.public + "/robots.txt",
          to: ".",
          globOptions: {
            ignore: ["*.DS_Store"]
          }
        }
      ]
    }),
    // GENERATE HMTL FILE
    new HtmlWebpackPlugin({
      template: paths.public + "/index.html",
      favicon: paths.public + "/assets/favicon.ico",
      filename: "index.html"
    }),
    new DefinePlugin({
      "process.env": JSON.stringify(dotenv.config().parsed) // it will automatically pick up key values from .env file
    })
  ],

  // ALIAS
  resolve: {
    alias: {
      "@actions": path.resolve(__dirname, "../src/store/actions"),
      "@utils": path.resolve(__dirname, "../src/utils"),
      "@components": path.resolve(__dirname, "../src/components"),
      "@elements": path.resolve(__dirname, "../src/components/elements"),
      "@pages": path.resolve(__dirname, "../src/components/pages"),
      "@layout": path.resolve(__dirname, "../src/components/layout"),
      "@translations": path.resolve(__dirname, "../src/translations"),
      "@styles": path.resolve(__dirname, "../src/styles")
    },
    extensions: ["", ".js", ".json"]
  },

  // MODULE MANAGEMENT
  module: {
    rules: [
      // JAVASCRIPT
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env", { targets: "> 0.25%, not dead" }]],
            plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties", "@babel/plugin-transform-modules-commonjs"]
          }
        }
      },
      // STYLING
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]]
              }
            }
          }
        ]
      },
      // IMAGE
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ["file-loader?name=[name].[ext]"]
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource"
      },
      // FONTS
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline"
      }
    ]
  }
}
