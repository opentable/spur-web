describe "ErrorMiddleware", ->

  beforeEach ()->
    injector().inject (@ErrorMiddleware)=>

  afterEach ()->

  it "should exist", ->
    expect(@ErrorMiddleware).to.exist
