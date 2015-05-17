module.exports = (Logger)->

  class BaseMiddleware

    configure:()->
      Logger.log "Registering Middleware: #{@constructor.name}"
