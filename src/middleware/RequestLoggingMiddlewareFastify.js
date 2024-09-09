module.exports = function (config, Logger, BaseMiddleware) {
  class RequestLoggingMiddlewareFastify extends BaseMiddleware {
    register(app) {
      super.configure(app);

      app.addHook('onResponse', (req, reply, done) => {
        const metaData = !!config.WinstonWebLogging?.meta
          ? {
            res: { statusCode: reply.statusCode },
            req: {
              url: req.url,
              headers: req.headers,
              method: req.method,
              httpVersion: req.raw.httpVersion,
              originalUrl: req.originalUrl,
              query: req.query,
            },
            responseTime: reply.elapsedTime,
          }
          : {};

        Logger.log(
          'info',
          `${req.method} ${req.url} ${reply.statusCode} ${Math.ceil(reply.elapsedTime)}ms`,
          metaData);
        done();
      });
    }
  }

  return new RequestLoggingMiddlewareFastify();
};
