nock = require("nock")

describe "ErrorMiddleware", ->

  beforeEach ()->

    nock.enableNetConnect()

    injector().inject (@ErrorMiddleware, @HTTPService, @BaseWebServer, @HtmlErrorRender, @Logger, @config, @_)=>
      @mockPort = 9080

      sinon.spy @HtmlErrorRender, "render"
      sinon.spy @ErrorMiddleware, "sendTextResponse"
      sinon.spy @ErrorMiddleware, "sendHtmlResponse"
      sinon.spy @ErrorMiddleware, "sendJsonResponse"

      @InternalServerError = "http://localhost:#{@mockPort}/500-error-test"
      @NotFoundError = "http://localhost:#{@mockPort}/404-error-test"
      @NotFoundErrorUndefined = "http://localhost:#{@mockPort}/cant-find-this-path"

      @webServer = new class WebServer extends @BaseWebServer
        registerLoggingMiddleware:()->

      @startServerOnPort = (port)=>
        @config.Port = port
        @Logger.useRecorder()
        @webServer.start()

      @sendRequest = (accept, url)->
        @startServerOnPort(@mockPort).then =>
          @HTTPService
            .get(url)
            .set({'Accept': accept})
            .promise()

  afterEach ()->
    @webServer?.stop().then =>
      expect(@_.last(@Logger.recorded.log)).to.deep.equal [
        "Express server stopped"
      ]

  describe "server errors", ->

    it "should attempt to render an html request", ->
      @sendRequest("text/html", @InternalServerError).error (response)=>
        expect(response.statusCode).to.equal(500)
        expect(@ErrorMiddleware.sendHtmlResponse.called).to.equal(true)
        expect(@HtmlErrorRender.render.called).to.equal(true)

    it "should attempt to render an json request", ->
      @sendRequest("application/json", @InternalServerError).error (response)=>
        expect(response.statusCode).to.equal(500)
        expect(@ErrorMiddleware.sendJsonResponse.called).to.equal(true)

    it "should attempt to render an text request", ->
      @sendRequest("text/plain", @InternalServerError).error (response)=>
        expect(response.statusCode).to.equal(500)
        expect(@ErrorMiddleware.sendTextResponse.called).to.equal(true)

  describe "not found errors", ->

    it "should attempt to render an html request", ->
      @sendRequest("text/html", @NotFoundError).error (response)=>
        expect(response.statusCode).to.equal(404)
        expect(@ErrorMiddleware.sendHtmlResponse.called).to.equal(true)
        expect(@HtmlErrorRender.render.called).to.equal(true)

    it "should attempt to render an json request", ->
      @sendRequest("application/json", @NotFoundError).error (response)=>
        expect(response.statusCode).to.equal(404)
        expect(@ErrorMiddleware.sendJsonResponse.called).to.equal(true)

    it "should attempt to render an text request", ->
      @sendRequest("text/plain", @NotFoundError).error (response)=>
        expect(response.statusCode).to.equal(404)
        expect(@ErrorMiddleware.sendTextResponse.called).to.equal(true)

  describe "not found errors from undefined", ->

    it "should attempt to render an html request", ->
      @sendRequest("text/html", @NotFoundErrorUndefined).error (response)=>
        expect(response.statusCode).to.equal(404)
        expect(@ErrorMiddleware.sendHtmlResponse.called).to.equal(true)
        expect(@HtmlErrorRender.render.called).to.equal(true)

    it "should attempt to render an json request", ->
      @sendRequest("application/json", @NotFoundErrorUndefined).error (response)=>
        expect(response.statusCode).to.equal(404)
        expect(@ErrorMiddleware.sendJsonResponse.called).to.equal(true)

    it "should attempt to render an text request", ->
      @sendRequest("text/plain", @NotFoundErrorUndefined).error (response)=>
        expect(response.statusCode).to.equal(404)
        expect(@ErrorMiddleware.sendTextResponse.called).to.equal(true)
