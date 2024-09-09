const fastifyView = require('@fastify/view');

const FastifyRegistrationHelper = require('../fastify/FastifyRegistrationHelper');

module.exports = function ($injector, Logger, BaseController) {
  const controllers = $injector.getRegex(/Controller$/);

  class ControllerRegistrationFastify {
    async register(app) {
      const registrationHelper = new FastifyRegistrationHelper();

      const registeredCount = Object.values(controllers).reduce((count, controller) => {
        if (controller instanceof BaseController) {
          // Call the configuration against every controller
          controller.configure(registrationHelper);
          return (count ?? 0) + 1;
        }
      }, 0);

      Logger.info(`Registered ${registeredCount} Controller(s)`, { count: registeredCount });

      Object.entries(registrationHelper.getRoutes()).forEach(([method, routes]) => {
        routes.forEach((route) => {
          app[method.toLowerCase()](...route);
        });
      });

      const viewInfo = registrationHelper.getViewInfo();
      // istanbul ignore else -- the test setup will always have the view engine
      if (viewInfo.engine) {
        await app.register(fastifyView, {
          engine: {
            ejs: viewInfo.engine,
          },
          root: viewInfo.viewDirectory,
          viewExt: viewInfo.viewExtension,
        });
      }

      return registeredCount;
    }
  }

  return new ControllerRegistrationFastify();
};
