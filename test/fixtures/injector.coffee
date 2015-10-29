path           = require "path"
spur           = require "spur-ioc"
spurCommon     = require "spur-common"
localInjector  = require "../../src/injector"
registerConfig = require "spur-common/registerConfig"
colors         = require "colors"

module.exports = () ->

  ioc = spur.create("test-spur-web")

  registerConfig(ioc, path.join(__dirname, "config"))

  ioc.merge(spurCommon())
  ioc.merge(localInjector())

  ioc.registerFolders __dirname, [
    "controllers"
  ]

  ioc.registerDependencies {
    colors: colors
  }

  ioc
