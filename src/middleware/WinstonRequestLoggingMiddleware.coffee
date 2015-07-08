module.exports = (Logger, expressWinston, BaseMiddleware, config, _)->

  new class WinstonRequestLoggingMiddleware extends BaseMiddleware

    configure:(@app)->
      super

      @config = config.WinstonWebLogging or {}

      @options = {
        winstonInstance : Logger
        meta            : true
        expressFormat   : true
        colorStatus     : true
      }

      @app.use expressWinston.logger(_.extend(@options, @config))
