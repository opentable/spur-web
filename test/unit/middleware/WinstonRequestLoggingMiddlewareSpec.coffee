describe "WinstonRequestLoggingMiddleware", ->

  beforeEach ()->
    injector().inject (@WinstonRequestLoggingMiddleware)=>

  afterEach ()->

  it "should exist", ->
    expect(@WinstonRequestLoggingMiddleware).to.exist
