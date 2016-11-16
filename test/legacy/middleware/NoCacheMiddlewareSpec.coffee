describe "NoCacheMiddleware", ->

  beforeEach ()->
    injector().inject (@NoCacheMiddleware)=>

  it "should exist", ->
    expect(@NoCacheMiddleware).to.exist
