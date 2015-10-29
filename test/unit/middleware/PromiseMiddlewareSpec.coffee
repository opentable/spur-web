describe "PromiseMiddleware", ->

  beforeEach ()->
    injector().inject (@PromiseMiddleware)=>

  it "should exist", ->
    expect(@PromiseMiddleware).to.exist
