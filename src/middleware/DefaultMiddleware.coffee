module.exports = (bodyParser, cookieParser, methodOverride, expressDevice, BaseMiddleware)->

  new class DefaultMiddleware extends BaseMiddleware

    configure:(@app)->
      super
      @app.use(cookieParser())
      @app.use(bodyParser.urlencoded({ extended: false }))
      @app.use(bodyParser.json())
      @app.use(methodOverride())
      @app.use(expressDevice.capture())
