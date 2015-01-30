module.exports = (config, Logger)->

  class BaseController

    constructor:()->
      @rootWebPath = config.RootWebPath or ""

    configure:()->
      Logger.info "Registering controller: #{@constructor.name}"

