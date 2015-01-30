module.exports = (config)->

  class BaseController

    constructor:()->
      @rootWebPath = config.RootWebPath or ""

    configure:()->
