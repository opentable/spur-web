module.exports = (Logger)->

  class BaseMiddleware

    configure:()->
      Logger.info "Registering Middleware: #{@constructor.name}"
