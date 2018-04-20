// var webpack = require('webpack');
// var path = require('path');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './bin/www.js',
  target: 'node',
  output: {
    filename: 'build.js'
  },
  externals: nodeModules
}
