spur       = require "spur-ioc"
spurCommon = require "spur-common"
path       = require "path"

module.exports = ()->

  ioc = spur.create("spur-web")

  ioc.registerDependencies {
    "express"         : require "express"
    "expressDevice"   : require "express-device"
    "methodOverride"  : require "method-override"
    "cookieParser"    : require "cookie-parser"
    "bodyParser"      : require "body-parser"
    "expressWinston"  : require "express-winston"
    "ejs"             : require "ejs"
  }


  ioc.registerFolders __dirname, [
    "middleware"
    "webserver"
  ]
  ioc.merge(spurCommon())


  ioc
