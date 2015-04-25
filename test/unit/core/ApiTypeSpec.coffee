describe "ApiType", ->

  beforeEach ->
    injector().inject (@ApiType, @config) =>

  afterEach ->

  it "should default to serverMocked when not ApiType is not defined in config", ->
    expect(@ApiType.value).to.equal("serverMocked")
    expect(@ApiType.isServerMocked()).to.equal(true)

  it "isServerMocked()", ->
    @ApiType.value = "serverMocked"
    expect(@ApiType.isServerMocked()).to.equal(true)
    expect(@ApiType.isRealApi()).to.equal(false)
    expect(@ApiType.isAuthenticateTestRid()).to.equal(false)

  it "isRealApi()", ->
    @ApiType.value = "realApi"
    expect(@ApiType.isRealApi()).to.equal(true)
    expect(@ApiType.isServerMocked()).to.equal(false)
    expect(@ApiType.isAuthenticateTestRid()).to.equal(false)

  it "isAuthenticateTestRid()", ->
    @ApiType.value = "authenticateTestRid"
    expect(@ApiType.isAuthenticateTestRid()).to.equal(true)
    expect(@ApiType.isRealApi()).to.equal(false)
    expect(@ApiType.isServerMocked()).to.equal(false)
