const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const FRONTEND_JS = "./src/client/js/";
module.exports = {
  entry: {
    main: FRONTEND_JS + "main.js",
    videoPlayer: FRONTEND_JS + "videoPlayer.js",
    commentSection: FRONTEND_JS + "commentSection.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
