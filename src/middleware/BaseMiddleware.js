module.exports = function (Logger) {
  class BaseMiddleware {
    configure() {
      Logger.info(`Registering Middleware: ${this.constructor.name}`);
    }
  }

  return BaseMiddleware;
};
