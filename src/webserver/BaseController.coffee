module.exports = (config, Logger)->

  class BaseController

    constructor:()->
      @rootWebPath = config.RootWebPath or ""

    configure:()->
      Logger.log "Registering controller: #{@constructor.name}"
