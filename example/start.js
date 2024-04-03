const injector = require('./src/injector');

injector().inject(function (UncaughtHandler, WebServer, Logger, config, configLoader, nodeProcess) {
  UncaughtHandler.listen();

  Logger.info(`NODE_ENV: ${nodeProcess.env.NODE_ENV}`);
  Logger.info(`PORT: ${config.Port}`);
  Logger.info(`CONFIG: ${configLoader.configName}`);

  WebServer.start().then(() => {
    // Execute other logic after the server has started
  });
});
