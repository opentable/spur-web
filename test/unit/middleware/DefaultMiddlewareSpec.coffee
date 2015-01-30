describe "DefaultMiddleware", ->

  beforeEach ()->
    injector().inject (@DefaultMiddleware)=>

  afterEach ()->

  it "should exist", ->
    expect(@DefaultMiddleware).to.exist
