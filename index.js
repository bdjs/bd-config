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
    if (process.env.NODE_ENV == 'local' && process.env.NODE_DEV) {  // 在本地调试测试环境的数据
      let port = configs.port;
      let logger = configs.logger;
      let devFile = path.join(envDir, 'development');
      configs = assign(configs, requireConfig(devFile));
      configs.port = port;
      configs.logger = logger;
    }
  }
  // read configs
  var files = fs.readdirSync(root);
  files.map(function(file) {
    if (file[0] === '.') {
      return;
    }
    if (path.extname(file) === '.js') {
      var config = requireConfig(path.join(root, file));
      var key = path.basename(file, '.js');
      configs[key] = config;
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
