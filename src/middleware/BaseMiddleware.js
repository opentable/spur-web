module.exports = function (
  Logger
) {
  class BaseMiddleware {
    configure(app) {
      this.app = app;
      Logger.info(`Registering Middleware: ${this.constructor.name}`);
    }
  }

  return BaseMiddleware;
};
