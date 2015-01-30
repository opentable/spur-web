module.exports = (Logger, expressWinston)->

  new class WinstonRequestLoggingMiddleware

    configure:(@app)->
      @app.use expressWinston.logger {
        winstonInstance : Logger
        meta            : true
        expressFormat   : false
        colorStatus     : true
      }
