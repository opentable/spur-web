module.exports = (BaseWebServer, Logger, path) ->

  new class TestWebServer extends BaseWebServer

    registerDefaultMiddleware: ->
      super
      @registerEjsTemplates()

    registerEjsTemplates: ->
      Logger.log("EJS Template Registration")

      @app.set('view engine', 'ejs')
      @app.set('views', path.join(__dirname, "../views"))
