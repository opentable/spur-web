module.exports = function (BaseWebServer) {
  class TestWebServer extends BaseWebServer {
    registerDefaultMiddleware() {
      super.registerDefaultMiddleware();
    }
  }

  return new TestWebServer();
};
