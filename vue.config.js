const { version } = require('./package.json')
const   path      = require('path')

process.env.VUE_APP_VERSION = version

module.exports = {
  lintOnSave  : process.env.NODE_ENV !== 'production',
  css         : { extract: true },
  chainWebpack: config => {
    config.resolve.alias
      .set('@src', path.resolve(__dirname, 'src'))
  }
}