const path = require("path")
const webpack = require("webpack")

const PATHS = {
  src: path.join(__dirname, "..", "src"),
  style: path.join(__dirname, "..", "src", "style"),
  build: path.join(__dirname, "..", "dist")
}

const config = {
  entry: [PATHS.src + "/index.tsx"],
  externals: {
    cheerio: "window",
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
      umd: "react"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
      umd: "react-dom"
    }
  },
  output: {
    path: PATHS.build,
    filename: "main.js",
    library: "reactJsonView",
    libraryTarget: "umd",
    globalObject: "this"
  },
  plugins: [],
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"]
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: "babel-loader"
          }
        ],
        include: [PATHS.src]
      }
    ]
  }
}

module.exports = config
