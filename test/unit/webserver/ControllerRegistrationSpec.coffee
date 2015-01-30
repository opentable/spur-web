describe "ControllerRegistration", ->

  beforeEach ()->
    injector().inject (@ControllerRegistration)=>

  afterEach ()->

  it "should exist", ->
    expect(@ControllerRegistration).to.exist
