spur       = require "spur-ioc"
spurWeb    = require "../../src/injector"
spurCommon = require "spur-common"

module.exports = ()->

  ioc = spur.create("test-spur-web")

  ioc.addDependency "config", {
    RootWebPath   : "/user/agustin/test/"
  }

  ioc.merge(spurCommon())
  ioc.merge(spurWeb())

  ioc
