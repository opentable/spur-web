const _values = require('lodash.values');
const _filter = require('lodash.filter');
const _invokeMap = require('lodash.invokemap');

module.exports = function ($injector, Logger, BaseController) {
  const controllers = $injector.getRegex(/Controller$/);

  class ControllerRegistration {

    register(app) {
      const instanceOfBaseController = function (c) {
        return (c instanceof BaseController);
      };

      const filteredValues = _filter(_values(controllers), instanceOfBaseController);

      // Call the configuration against every controller
      _invokeMap(filteredValues, 'configure', app);

      const registeredCount = filteredValues.length;

      Logger.info(`Registered ${registeredCount} Controller(s)`, { count: registeredCount });

      return registeredCount;
    }
  }

  return new ControllerRegistration();
};
