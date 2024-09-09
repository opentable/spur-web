const fastifyCookie = require('@fastify/cookie');
const device = require('device');

module.exports = function (BaseMiddleware) {
  class DefaultMiddlewareFastify extends BaseMiddleware {
    register(app) {
      super.configure(app);

      app.register(fastifyCookie);

      app.addHook('preHandler', (req, reply, next) => {
        const { type, model } = device(req.headers['user-agent'], { parseUserAgent: true });
        Object.assign(req, { device: { type, name: model } });
        next();
      });
    }
  }

  return new DefaultMiddlewareFastify();
};
