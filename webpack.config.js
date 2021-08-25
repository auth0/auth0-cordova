const path = require('path');
const webpack = require('webpack');

const config = {
  context: __dirname,
  mode: 'production',
  entry: {
    'index.js': './src/index.js',
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]',
    libraryTarget: 'umd',
    library: 'PKCEClient',
  },

  resolve: {
    alias: {
      'bn.js': path.join(__dirname, 'node_modules/bn.js/lib/bn.js'),
    },
  },

  devtool: 'source-map',

  plugins: [
    new webpack.ProgressPlugin((prog) => {
      if (prog === 0) console.log('[webpack]: Bundle is now invalid.');
      if (prog === 1) console.log('[webpack]: Bundle is now valid.');
    }),
  ],
};
module.exports = config;
