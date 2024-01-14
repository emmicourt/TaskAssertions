/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

//const isProduction = process.env.NODE_ENV == "production";

module.exports = {
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  target: "node",
  node: {
    __dirname: false,
    __filename: false

  },
  module: {
    rules: [
      {
        test: /azure-pipelines-task-lib[/\\]internal\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'require[(]([^\'"])',
          replace: '__non_webpack_require__($1',
          flags: 'g'
        }
      },
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
