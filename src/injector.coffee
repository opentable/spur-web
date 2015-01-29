spur = require "spur-ioc"
spurCommon = require "spur-common"
path = require "path"

module.exports = ()->

  ioc = spur.create("spur-web")

  ioc.registerDependencies {
  }

  ioc.registerFolders __dirname, [
  ]

  ioc.merge(spurCommon())

  ioc
