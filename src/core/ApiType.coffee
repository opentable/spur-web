module.exports = (config)->

  new class ApiType

    constructor:()->
      @value = config.ApiType or "serverMocked"

    isServerMocked:()->
      @value is "serverMocked"

    isRealApi:()->
      @value is "realApi"

    isAuthenticateTestRid:()->
      @value is "authenticateTestRid"
