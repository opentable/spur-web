describe "PromiseMiddleware", ->

  beforeEach (done)->
    injector()
    .inject (@TestWebServer, @HTTPService, @Logger, @config) =>
      @Logger.useRecorder()

      @getResponse = (type) =>
        url = "http://localhost:#{@config.Port}/promise-middleware-test--#{type}"
        @HTTPService
          .get(url)

      @TestWebServer.start().then(done)

  afterEach ()->
    @TestWebServer.stop()

  it "jsonAsync - success", (done) ->
    @getResponse("jsonasync").promise().then (response)=>
      expect(response.type).to.equal("application/json")
      expect(response.body).to.equal("jsonAsync success")
      done()


  it "renderAsync - success", (done)->
    @getResponse("renderasync").promise().then (response)=>
      expect(response.type).to.equal("text/html")
      expect(response.text).to.contain("renderView from ejs: renderAsync success")
      done()

  it "sendStatusAsync - success", (done)->
    @getResponse("sendstatusasync").promise().then (response)=>
      expect(response.type).to.equal("text/plain")
      expect(response.status).to.equal(200)
      expect(response.text).to.equal("OK")
      done()
