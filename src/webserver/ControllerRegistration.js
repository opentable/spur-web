module.exports = function ($injector, Logger, BaseController) {
  const controllers = $injector.getRegex(/Controller$/) || [];

  class ControllerRegistration {
    register(app) {
      const registeredCount = Object.values(controllers).reduce((count, controller) => {
        if (controller instanceof BaseController) {
          // Call the configuration against every controller
          controller.configure(app);
          return count + 1;
        }
      }, 0);

      Logger.info(`Registered ${registeredCount} Controller(s)`, { count: registeredCount });

      return registeredCount;
    }
  }

  return new ControllerRegistration();
};
