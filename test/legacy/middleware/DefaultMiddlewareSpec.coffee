describe "DefaultMiddleware", ->

  beforeEach ()->
    injector().inject (@DefaultMiddleware)=>

  it "should exist", ->
    expect(@DefaultMiddleware).to.exist
