'use strict';

var path = require('path');
var fs = require('fs');
var assign = require('object-assign');
var debug = require('debug')('bd-config');

var defaultRoot = path.join(
  path.dirname(process.mainModule.filename),
  'configs'
);
var env = process.env.NODE_ENV || 'development';
var configs = {};

module.exports = function(root) {
  root = root || defaultRoot;
  debug(root);
  if (!fs.existsSync(root)) {
    return;
  }
  var envDir = path.join(root, 'env');
  var envFile = path.join(envDir, env);
  envFile += '.js';
  // env configs
  if (fs.existsSync(envDir) && fs.existsSync(envFile)) {
    debug(envFile);
    configs = assign(configs, requireConfig(envFile));
  }
  // read configs
  var files = fs.readdirSync(root);
  files.map(function(file) {
    if (file[0] === '.') {
      return;
    }
    if (path.extname(file) === '.js') {
      configs = assign(configs, requireConfig(path.join(root, file)));
    }
  });
  return configs;
}

function requireConfig(configPath) {
  var config = require(configPath);
  if (typeof config != 'object') {
    return {};
  }
  return config;
}
