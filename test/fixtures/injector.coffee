spur = require "spur-ioc"
localInjector = require "../../src/injector"

module.exports = ()->

  ioc = spur.create("test-spur-web")
  ioc.merge(localInjector())

  ioc
