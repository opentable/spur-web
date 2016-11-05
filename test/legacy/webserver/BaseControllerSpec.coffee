describe "BaseController", ->

  beforeEach ()->
    injector().inject (@BaseController)=>

  it "should exist", ->
    expect(@BaseController).to.exist

  it "should map a rootWebPath from config", ->
    expect(new @BaseController().rootWebPath).to.equal("/user/agustin/test/")
