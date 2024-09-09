module.exports = function (config, ExpressWebServer, FastifyWebServer, Logger) {
  class BaseWebServer {
    #options;

    #getServerType() {
      return this.#options.withFastify ? 'Fastify' : 'Express';
    }

    create(options = {}) {
      this.#options = Object.assign({}, options);

      if (options.withFastify) {
        const fastifyServer = new FastifyWebServer();
        fastifyServer.create();
        this.instance = fastifyServer;
      } else {
        this.instance = new ExpressWebServer();
      }

      if (this.cluster) {
        // It's possible the cluster was set before the server was created
        this.instance.setCluster(this.cluster);
      }

      this.registerMiddleware();
      this.registerErrorMiddleware();

      return this;
    }

    get app() {
      return this.instance?.app;
    }

    get server() {
      return this.instance?.server;
    }

    getPort() {
      return this.instance?.getPort() ?? config.Port;
    }

    /* istanbul ignore next -- server implementation may or may not have registerDefaultMiddleware */
    registerDefaultMiddleware() {
      if (this.instance.registerDefaultMiddleware) {
        this.logSectionHeader('Default Middleware Registration');
        this.instance.registerDefaultMiddleware();
      }
    }

    /* istanbul ignore next -- server implementation may or may not have registerLoggingMiddleware */
    registerLoggingMiddleware() {
      if (this.instance.registerLoggingMiddleware) {
        this.logSectionHeader('Logging Middleware Registration');
        this.instance.registerLoggingMiddleware();
      }
    }

    registerMiddleware() {
      this.registerLoggingMiddleware();
      this.registerStaticMiddleware();
      this.registerDefaultMiddleware();
      this.registerTemplatingEngine();
      this.registerPromiseMiddleware();
      this.registerControllers();

    }

    /* istanbul ignore next -- server implementation may or may not have registerStaticMiddleware */
    registerStaticMiddleware() {
      if (this.instance.registerStaticMiddleware) {
        this.logSectionHeader('Static Middleware Registration');
        this.instance.registerStaticMiddleware();
      }
    }

    /* istanbul ignore next -- server implementation may or may not have registerTemplatingEngine */
    registerTemplatingEngine() {
      if (this.instance.registerTemplatingEngine) {
        this.logSectionHeader('Templating Engine Registration');
        this.instance.registerTemplatingEngine();
      }
    }

    /* istanbul ignore next -- server implementation may or may not have registerPromiseMiddleware */
    registerPromiseMiddleware() {
      if (this.instance.registerPromiseMiddleware) {
        this.logSectionHeader('Promise Middleware Registration');
        this.instance.registerPromiseMiddleware();
      }
    }

    /* istanbul ignore next -- server implementation may or may not have registerControllers */
    registerControllers() {
      if (this.instance.registerControllers) {
        this.logSectionHeader('Controller Registration');
        this.instance.registerControllers();
      }
    }

    /* istanbul ignore next -- server implementation may or may not have registerErrorMiddleware */
    registerErrorMiddleware() {
      if (this.instance.registerErrorMiddleware) {
        this.logSectionHeader('Error Middleware Registration');
        this.instance.registerErrorMiddleware();
      }
    }

    setCluster(cluster) {
      this.cluster = cluster;
      this.instance?.setCluster(cluster);
    }

    async start(options = {}) {
      if (!this.instance) {
        this.create(options);
      }

      await this.instance.start(this.#options).then(({ appliedOptions }) => {
        Logger.info(this.startedMessage(appliedOptions));
      });
      return Promise.resolve(this);
    }

    stop() {
      if (!this.instance) {
        return Promise.resolve();
      }

      return this.instance.stop().finally(() => {
        Logger.info(`${this.#getServerType()} server stopped`);
      });
    }

    startedMessage(appliedOptions) {
      const port = this.getPort();
      const optionsMessage = appliedOptions && !!Object.keys(appliedOptions).length ? ` with options: ${JSON.stringify(appliedOptions)}` : '';
      const startedOnMessage = `started on port ${port}${optionsMessage}`;
      if (this.cluster) {
        return `Worker ${this.cluster.worker.id} ${startedOnMessage}`;
      }

      return `${this.#getServerType()} server ${startedOnMessage}`;
    }

    logSectionHeader(message) {
      Logger.log('========================');
      Logger.info(`= ${message}`);
      Logger.log('========================');
    }
  }

  return BaseWebServer;
};
