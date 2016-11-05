module.exports = function ($injector, _, Logger, BaseController) {
  const controllers = $injector.getRegex(/Controller$/);

  class ControllerRegistration {

    register(app) {
      const instanceOfBaseController = function (c) {
        return (c instanceof BaseController);
      };

      const registeredCount = _.chain(controllers)
        .values()
        .filter(instanceOfBaseController)
        .invoke('configure', app)
        .value().length;

      Logger.info(`Registered ${registeredCount} Controller(s)`, { count: registeredCount });

      return registeredCount;
    }
  }

  return new ControllerRegistration();
};
