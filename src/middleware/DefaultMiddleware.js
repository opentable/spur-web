module.exports = function (bodyParser, cookieParser, methodOverride, expressDevice, BaseMiddleware) {
  class DefaultMiddleware extends BaseMiddleware {

    configure(app) {
      super.configure(app);

      this.app.use(cookieParser());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(bodyParser.json());
      this.app.use(methodOverride());
      this.app.use(expressDevice.capture());
    }

  }

  return new DefaultMiddleware();
};
