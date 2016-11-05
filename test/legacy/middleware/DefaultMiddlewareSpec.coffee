describe "DefaultMiddleware", ->

  beforeEach ()->
    injector().inject (@DefaultMiddleware, @express)=>

  it "should define configure", ->
    expect(@DefaultMiddleware.configure).to.exist

  it "should set app in the instance", ->
    app = @express()
    @DefaultMiddleware.configure(app)

    expect(@DefaultMiddleware.app).to.equal(app)
