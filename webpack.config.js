const path = require('path');
const webpack = require('webpack');

const config = {

  context: __dirname,

  entry: {
    'index.js':'./src/index.js',
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]',
    libraryTarget: 'umd',
    library: 'PKCEClient'
  },

  devtool: 'source-map',

  plugins: [
    new webpack.ProgressPlugin((prog) => {
        if(prog === 0) console.log("[webpack]: Bundle is now invalid.");
        if(prog === 1) console.log("[webpack]: Bundle is now valid.");
    })
  ]
}
module.exports = config;