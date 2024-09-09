module.exports = function (
  express,
  DefaultMiddleware,
  PromiseMiddleware,
  Promise,
  ErrorMiddleware,
  config,
  ControllerRegistration,
  WinstonRequestLoggingMiddleware,
) {
  class ExpressWebServer {
    constructor() {
      this.app = express();
    }

    getPort() {
      return this.server?.address()?.port ?? config.Port;
    }

    registerDefaultMiddleware() {
      DefaultMiddleware.configure(this.app);
    }

    registerLoggingMiddleware() {
      WinstonRequestLoggingMiddleware.configure(this.app);
    }

    registerPromiseMiddleware() {
      PromiseMiddleware.configure(this.app);
    }

    registerControllers() {
      ControllerRegistration.register(this.app);
    }

    registerErrorMiddleware() {
      ErrorMiddleware.configure(this.app);
    }

    setCluster(cluster) {
      this.cluster = cluster;
    }

    start(options) {
      return this.startInternal(options);
    }

    startInternal(options) {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        this.server = this.app.listen(config.Port, () => {
          const appliedOptions = {};
          if (options?.keepAliveTimeout && this.server.hasOwnProperty('keepAliveTimeout')) {
            this.server.keepAliveTimeout = options.keepAliveTimeout;
            appliedOptions.keepAliveTimeout = this.server.keepAliveTimeout;
          }

          resolve({ webServer: this, appliedOptions });
        });

        return Promise.promisifyAll(this.server);
      });
    }

    stop() {
      return this.getCloseAsync();
    }

    getCloseAsync() {
      if (this.server?.closeAsync) {
        return this.server.closeAsync();
      }

      return Promise.resolve();
    }
  }

  return ExpressWebServer;
};
