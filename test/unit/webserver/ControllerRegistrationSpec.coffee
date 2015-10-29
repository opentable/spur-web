describe "ControllerRegistration", ->

  beforeEach ()->
    injector().inject (@ControllerRegistration)=>

  it "should exist", ->
    expect(@ControllerRegistration).to.exist
