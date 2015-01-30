describe "PromiseMiddleware", ->

  beforeEach ()->
    injector().inject (@PromiseMiddleware)=>

  afterEach ()->

  it "should exist", ->
    expect(@PromiseMiddleware).to.exist
