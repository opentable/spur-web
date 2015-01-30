module.exports = ($injector, _, Logger, BaseController)->

  controllers = $injector.getRegex(/Controller$/)

  new class ControllerRegistration

    register:(app)->
      Logger.info "\nFound #{_.keys(controllers).length} controllers to register...\n"

      for name, controller of controllers
        if controller instanceof BaseController
          Logger.info "Registering controller: #{name}"
          controller.configure(app)
