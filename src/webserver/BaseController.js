module.exports = function (config, Logger) {
  class BaseController {
    constructor() {
      this.rootWebPath = config.RootWebPath || '';
    }

    configure() {
      Logger.info(`Registering controller: ${this.constructor.name}`);
    }
  }

  return BaseController;
};
