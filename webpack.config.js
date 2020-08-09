const path = require("path");

module.exports = {
  entry: {
    MediaProvider: "./src/MediaProvider.js",
    PreferenceProvider: "./src/PreferenceProvider.js",
    MicProvider: "./src/MicProvider.js",
  },
  output: {
    path: path.resolve(__dirname, "."),
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  externals: {
    react: "commonjs react",
  },
};
