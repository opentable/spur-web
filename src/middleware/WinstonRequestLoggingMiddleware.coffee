module.exports = (Logger, expressWinston, BaseMiddleware)->

  new class WinstonRequestLoggingMiddleware extends BaseMiddleware

    configure:(@app)->
      super
      @app.use expressWinston.logger {
        winstonInstance : Logger
        meta            : true
        expressFormat   : true
        colorStatus     : true
      }
