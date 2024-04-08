module.exports = function (Logger, expressWinston, BaseMiddleware, config) {
  class WinstonRequestLoggingMiddleware extends BaseMiddleware {
    configure(app) {
      super.configure(app);

      this.config = config.WinstonWebLogging || {};

      this.options = {
        winstonInstance: Logger,
        meta: true,
        expressFormat: true,
      };

      this.app.use(expressWinston.logger(Object.assign(this.options, this.config)));
    }
  }

  return new WinstonRequestLoggingMiddleware();
};
