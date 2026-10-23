const path = require("path")
const webpack = require("webpack")

const PATHS = {
  src: path.join(__dirname, "..", "src"),
  style: path.join(__dirname, "..", "src", "style"),
  build: path.join(__dirname, "..", "dev-server", "dist"),
  devServer: path.join(__dirname, "..", "dev-server")
}

const config = {
  entry: [PATHS.devServer + "/src/index.js"],
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  },
  devServer: {
    host: "localhost",
    port: 2000,
    hot: true,
    inline: true,
    historyApiFallback: true,
    contentBase: PATHS.build
  },
  output: {
    path: PATHS.build,
    filename: "main.js",
    library: "reactJsonView",
    libraryTarget: "umd"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"]
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: "babel-loader"
          }
        ],
        include: [PATHS.src, PATHS.devServer]
      }
    ]
  }
}

module.exports = config
