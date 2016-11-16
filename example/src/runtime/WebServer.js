module.exports = function (BaseWebServer, path) {
  class WebServer extends BaseWebServer {

    // Add additional changes to the middleware by overriding the method
    registerDefaultMiddleware() {
      super.registerDefaultMiddleware();
      this.registerEjsTemplates();
    }

    registerEjsTemplates() {
      this.logSectionHeader('EJS Template Registration');

      this.app.set('view engine', 'ejs');
      this.app.set('views', path.join(__dirname, '../views'));
    }
  }

  // Assure there is just one instance
  return new WebServer();
};
