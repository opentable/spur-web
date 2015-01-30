module.exports = (bodyParser, cookieParser, methodOverride, expressDevice)->

  new class DefaultMiddleware

    configure:(@app)->
      @app.use(cookieParser())
      @app.use(bodyParser.urlencoded({ extended: false }))
      @app.use(bodyParser.json())
      @app.use(methodOverride())
      @app.use(expressDevice.capture())
