module.exports = function (
  express,
  DefaultMiddleware,
  PromiseMiddleware,
  Logger,
  Promise,
  ErrorMiddleware,
  config,
  ControllerRegistration,
  WinstonRequestLoggingMiddleware
) {
  class BaseWebServer {

    constructor() {
      this.app = express();
    }

    getPort() {
      return this.server?.address()?.port ?? config.Port;
    }

    registerDefaultMiddleware() {
      this.logSectionHeader('Default Middleware Registration');
      DefaultMiddleware.configure(this.app);
    }

    registerLoggingMiddleware() {
      this.logSectionHeader('Logging Middleware Registration');
      WinstonRequestLoggingMiddleware.configure(this.app);
    }

    registerMiddleware() {
      this.registerLoggingMiddleware();
      this.registerStaticMiddleware();
      this.registerDefaultMiddleware();
      this.registerTemplatingEngine();
      PromiseMiddleware.configure(this.app);
      this.registerControllers();
    }

    registerStaticMiddleware() {}

    registerTemplatingEngine() {}

    registerControllers() {
      this.logSectionHeader('Controller Registration');
      ControllerRegistration.register(this.app);
    }

    registerErrorMiddleware() {
      this.logSectionHeader('Error Middleware Registration');
      ErrorMiddleware.configure(this.app);
    }

    setCluster(cluster) {
      this.cluster = cluster;
    }

    start() {
      this.registerMiddleware();
      this.registerErrorMiddleware();

      return this.startInternal();
    }

    startInternal() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        this.server = this.app.listen(config.Port, () => {
          Logger.info(this.startedMessage());
          resolve();
        });

        return Promise.promisifyAll(this.server);
      });
    }

    stop() {
      return this.getCloseAsync().finally(() => {
        Logger.info('Express server stopped');
      });
    }

    getCloseAsync() {
      if (this.server?.closeAsync) {
        return this.server.closeAsync();
      }

      return Promise.resolve();
    }

    startedMessage() {
      const port = this.getPort();
      if (this.cluster) {
        return `Worker ${this.cluster.worker.id} started on port ${port}`;
      }

      return `Express app started on port ${port}`;
    }

    logSectionHeader(message) {
      Logger.log('========================');
      Logger.info(`= ${message}`);
      Logger.log('========================');
    }
  }

  return BaseWebServer;
};
