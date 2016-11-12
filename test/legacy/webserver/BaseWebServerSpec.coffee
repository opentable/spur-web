describe "BaseWebServer", ->

  beforeEach () ->
    injector().inject (@TestWebServer, @config, @Utils, @HTTPService, @Logger, @_)=>
      @Logger.useRecorder()
      @TestWebServer.start()

  afterEach () ->
    @TestWebServer.stop()

  it "get index", (done) ->
    @HTTPService.get("http://localhost:9088/").promise().then (res)=>
      expect(res.text).to.equal "SomeIndex"
      done()
