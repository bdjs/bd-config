/* eslint-disable import/no-dynamic-require */

const path = require('path')
const fs = require('fs')

const defaultRoot = path.join(
  path.dirname(process.mainModule.filename),
  'configs'
)
const env = process.env.NODE_ENV || 'development'
let configs = {}

module.exports = (root = defaultRoot) => {
  if (!fs.existsSync(root)) {
    return
  }
  const envDir = path.join(root, 'env')
  let envFile = path.join(envDir, env)
  envFile += '.js'
  // env configs
  if (fs.existsSync(envDir) && fs.existsSync(envFile)) {
    configs = Object.assign(configs, requireConfig(envFile))
  }
  // read configs
  const files = fs.readdirSync(root)
  files.forEach(file => {
    if (file.startsWith('.')) {
      return
    }
    if (path.extname(file) === '.js') {
      const config = requireConfig(path.join(root, file))
      const key = path.basename(file, '.js')
      configs[key] = config
    }
  })

  return configs
}

function requireConfig (configPath) {
  const config = require(configPath)
  if (typeof config !== 'object') {
    return {}
  }
  return config
}
