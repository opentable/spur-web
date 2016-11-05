describe "BaseWebServer", ->

  beforeEach () ->
    injector().inject (@WebServer, @config, @Utils, @HTTPService, @Logger, @_)=>
      @Logger.useRecorder()
      @WebServer.start()

  afterEach () ->
    @WebServer.stop()

  it "get index", (done) ->
    @HTTPService.get("http://localhost:9088/").promise().then (res)=>
      expect(res.text).to.equal "SomeIndex"
      done()
