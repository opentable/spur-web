module.exports = function (Logger, expressWinston, BaseMiddleware, config, _) {
  class WinstonRequestLoggingMiddleware extends BaseMiddleware {

    configure(app) {
      super.configure(app);

      this.config = config.WinstonWebLogging || {};

      this.options = {
        winstonInstance: Logger,
        meta: true,
        expressFormat: true,
        colorStatus: true
      };

      this.app.use(expressWinston.logger(_.extend(this.options, this.config)));
    }

  }

  return new WinstonRequestLoggingMiddleware();
};
