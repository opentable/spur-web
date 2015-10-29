describe "WinstonRequestLoggingMiddleware", ->

  beforeEach ()->
    @MockPort = 9088

    injector()
      .inject (@WinstonRequestLoggingMiddleware, @expressWinston, @express,
        @HTTPService, @Logger, @config, @_, @BaseWebServer, @colors, @MockController)=>
        sinon.spy @expressWinston, "logger"
        @app = @express()
        @Logger.useNoop()

  afterEach ()->
    @expressWinston.logger.restore()

  describe "configure() with defaults", ->

    beforeEach ->
      @WinstonRequestLoggingMiddleware.configure(@app)
      @instanceConfig = @WinstonRequestLoggingMiddleware.config
      @options = @WinstonRequestLoggingMiddleware.options

    it "should use empty config", ->
      expect(@instanceConfig).to.deep.equal {}

    it "should use the logger as the winston instance", ->
      expect(@options.winstonInstance).to.equal @Logger

    it "should use default options", ->
      expect(@options.meta).to.equal true
      expect(@options.expressFormat).to.equal true
      expect(@options.colorStatus).to.equal true

    it "should call expressWinston.logger with options", ->
      expect(@expressWinston.logger.getCall(0).args[0]).to.deep.equal @options

  describe "configure() with custom config", ->

    beforeEach ->
      @config.WinstonWebLogging = {
        meta: false
        expressFormat: false
        colorStatus: false
        fakeOption: "123"
      }

      @WinstonRequestLoggingMiddleware.configure(@app)
      @instanceConfig = @WinstonRequestLoggingMiddleware.config
      @options = @WinstonRequestLoggingMiddleware.options

    it "should use the logger as the winston instance", ->
      expect(@options.winstonInstance).to.equal @Logger

    it "should use custom options", ->
      expect(@options.meta).to.equal false
      expect(@options.expressFormat).to.equal false
      expect(@options.colorStatus).to.equal false

    it "should add a non-default option", ->
      expect(@options.fakeOption).to.equal "123"

    it "should call expressWinston.logger with options", ->
      expect(@expressWinston.logger.getCall(0).args[0]).to.deep.equal @options

  describe "with request", ->

    beforeEach ->
      @startServerOnPort = ()=>
        @Logger.useRecorder()
        @webServer = new class WebServer extends @BaseWebServer

        @webServer.start()

    afterEach ->
      @webServer?.stop().then =>
        expect(@_.last(@Logger.recorded.info)).to.deep.equal [
          "Express server stopped"
        ]

    it "should log a winston request with json meta", ->
      @startServerOnPort().then =>
        @HTTPService.get("http://localhost:#{@MockPort}").promise().then (res)=>

          lastEntry = @_.last(@Logger.recorded.log)
          message = @colors.strip(lastEntry[1])
          data = lastEntry[2]

          expectedData = {
            "req": {
              "headers": {
                "accept-encoding": "gzip, deflate"
                "connection": "close"
                "host": "localhost:9088"
                "user-agent": "node-superagent/0.21.0"
              }
              "httpVersion": "1.1"
              "method": "GET"
              "originalUrl": "/"
              "query": {}
              "url": "/"
            }
            "res": {
              "statusCode": 200
            }
            "responseTime": data.responseTime
          }

          expect(lastEntry[0]).to.equal "info"
          expect(message).to.equal "GET / 200 #{data.responseTime}ms"
          expect(data).to.deep.equal expectedData

    it "should log a winston request with meta", ->
      @config.WinstonWebLogging = {expressFormat: true, meta: false}

      @startServerOnPort().then =>

        @HTTPService.get("http://localhost:#{@MockPort}").promise().then (res)=>
          lastEntry = @_.last(@Logger.recorded.log)
          message = @colors.strip(lastEntry[1])
          data = lastEntry[2]
          expectedData = {}

          expect(lastEntry[0]).to.equal "info"
          expect(message).to.contain "GET / 200"
          expect(data).to.deep.equal expectedData

    it "should log a winston request with meta for error", ->

      @config.WinstonWebLogging = {expressFormat: true, meta: false}

      @startServerOnPort().then =>

        @HTTPService.get("http://localhost:#{@MockPort}/with-error").promise().error (res)=>

          lastEntry = @_.last(@Logger.recorded.log)
          message = @colors.strip(lastEntry[1])
          data = lastEntry[2]
          expectedData = {}

          expect(lastEntry[0]).to.equal "info"
          expect(message).to.contain "GET /with-error 500"
          expect(data).to.deep.equal expectedData
