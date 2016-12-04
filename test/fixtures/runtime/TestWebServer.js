module.exports = function (BaseWebServer, Logger, path) {

  class TestWebServer extends BaseWebServer {

    registerDefaultMiddleware(){
      super.registerDefaultMiddleware();
      this.registerEjsTemplates();
    }

    registerEjsTemplates() {
      Logger.log('EJS Template Registration');

      this.app.set('view engine', 'ejs');
      this.app.set('views', path.join(__dirname, '../views'));
    }
  }

  return new TestWebServer();
}
