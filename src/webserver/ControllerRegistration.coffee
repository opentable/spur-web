module.exports = ($injector, _, Logger, BaseController)->

  controllers = $injector.getRegex(/Controller$/)

  new class ControllerRegistration

    register:(app)->

      instanceOfBaseController = (c)->
        c instanceof BaseController

      registeredCount = _.chain(controllers)
        .values()
        .filter(instanceOfBaseController)
        .invoke("configure", app)
        .value().length

      Logger.info "Registered #{registeredCount} Controller(s)"
