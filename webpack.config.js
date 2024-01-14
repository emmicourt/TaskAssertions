/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /azure-pipelines-task-lib[/\\]internal\.js$/,
        loader: "string-replace-loader",
        options: {
          search: "require[(]([^'\"])",
          replace: "__non_webpack_require__($1",
          flags: "g",
        },
      },
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "ado-extension-configs" }],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
