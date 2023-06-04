const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    fallback: {
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
      //zlib: require.resolve("browserify-zlib"),
      zlib: false,
      fs: false,
    },
  },
  resolve: {
    alias: {
      fs: 'graceful-fs' // Use the 'graceful-fs' polyfill for 'fs' module
    }
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
  },
};
