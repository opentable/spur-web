const fastify = require('fastify');
const { createServerLogger } = require('../fastify/FastifyLogger');

module.exports = function (
  config,
  ControllerRegistrationFastify,
  DefaultMiddlewareFastify,
  ErrorMiddlewareFastify,
  Logger,
  PromiseMiddlewareFastify,
  RequestLoggingMiddlewareFastify,
) {
  class FastifyWebServer {
    get server() {
      return this.app?.server;
    }

    create() {
      const logger = createServerLogger(Logger, { severity: 'debug' });
      this.app = fastify({ logger, disableRequestLogging: true, caseSensitive: false });

      return this;
    }

    getPort() {
      return this.app?.server?.address()?.port ?? config.Port;
    }

    registerDefaultMiddleware() {
      DefaultMiddlewareFastify.register(this.app);
    }

    registerLoggingMiddleware() {
      RequestLoggingMiddlewareFastify.register(this.app);
    }

    registerPromiseMiddleware() {
      PromiseMiddlewareFastify.register(this.app);
    }

    registerControllers() {
      ControllerRegistrationFastify.register(this.app);
    }

    registerErrorMiddleware() {
      ErrorMiddlewareFastify.register(this.app);
    }

    setCluster(cluster) {
      this.cluster = cluster;
    }

    async start(options) {
      const { Port: port } = config;

      if (!this.app) {
        this.create();
      }

      return new Promise((resolve, reject) => {
        this.app.listen({ port }, (err, address) => {
          /* istanbul ignore if */
          if (err) {
            Logger.error(err);
            reject(err);
          } else {
            this.app.ready(() => {
              const appliedOptions = {};
              if (options?.keepAliveTimeout && this.app.server.hasOwnProperty('keepAliveTimeout')) {
                this.app.server.keepAliveTimeout = options.keepAliveTimeout;
                appliedOptions.keepAliveTimeout = this.app.server.keepAliveTimeout;
              }

              resolve({ webServer: this, appliedOptions });
            });
          }
        });
      });
    }

    /* istanbul ignore next */
    startInternal() {
      console.error('startInternal not implemented for Fastify');
    }

    stop() {
      return this.app.close();
    }
  }

  return FastifyWebServer;
};
