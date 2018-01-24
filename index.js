'use strict'

const path = require('path')
const fs = require('fs')
const assign = require('object-assign')
const debug = require('debug')('bd-config')

const defaultRoot = path.join(
  path.dirname(process.mainModule.filename),
  'configs'
)
const env = process.env.NODE_ENV || 'development'
let configs = {}

module.exports = function (root = defaultRoot) {
  debug(root)
  if (!fs.existsSync(root)) {
    return
  }
  let envDir = path.join(root, 'env')
  let envFile = path.join(envDir, env)
  envFile += '.js'
  // env configs
  if (fs.existsSync(envDir) && fs.existsSync(envFile)) {
    debug(envFile)
    configs = Object.assign(configs, requireConfig(envFile))
  }
  // read configs
  let files = fs.readdirSync(root)
  files.forEach(file => {
    if (file[0] === '.') {
      return
    }
    if (path.extname(file) === '.js') {
      let config = requireConfig(path.join(root, file))
      let key = path.basename(file, '.js')
      configs[key] = config
    }
  })

  return configs
}

function requireConfig (configPath) {
  let config = require(configPath)
  if (typeof config !== 'object') {
    return {}
  }
  return config
}
