describe "BaseWebServer", ->

  beforeEach ->


    injector()
      .addResolvableDependency "IndexController", (BaseController)->
        new class IndexController extends BaseController

          configure:(@app)->
            super
            @app.get "/", (req, res)-> res.send "SomeIndex"

      .inject (@BaseWebServer, @config, @Utils, @HTTPService, @Logger, @_)=>
        @config.Port = 9080

        @Logger.useRecorder()
        @webServer =
          new class WebServer extends @BaseWebServer
            registerLoggingMiddleware:()->

        @webServer.start()

  afterEach ->
    @webServer?.stop().then =>
      expect(@_.last(@Logger.recorded.info)).to.deep.equal [
        "Express server stopped"
      ]

  it "get index", ->

    @HTTPService.get("http://localhost:9080").promise().then (res)=>
      expect(res.text).to.equal "SomeIndex"

      expect(@Logger.recorded.info).to.deep.equal [
        [ 'Registering Middleware: DefaultMiddleware' ],
        [ 'Registering Middleware: PromiseMiddleware' ],
        [ 'Registering controller: IndexController' ],
        [ 'Registered 1 Controller(s)' ],
        [ 'Registering Middleware: ErrorMiddleware' ],
        [ 'Express app started on port 9080' ]
      ]

