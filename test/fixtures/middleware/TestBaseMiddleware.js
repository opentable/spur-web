module.exports = function (BaseMiddleware, Logger) {

  class TestBaseMiddleware extends BaseMiddleware {

    configure() {
      super.configure();
      Logger.log('Subclass called');
    }
  }

  return new TestBaseMiddleware();
};
