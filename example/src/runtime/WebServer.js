module.exports = function (BaseWebServer) {
  class WebServer extends BaseWebServer {

    // Add additional changes to the middleware by overriding the method
    registerDefaultMiddleware() {
      super.registerDefaultMiddleware();
    }

  }

  // Assure there is just one instance
  return new WebServer();
};
