// Based on ServerLogger.js from otjs-fastify-prototype repo

let rootLogger;

const createServerLogger = (Logger, options) => {
  rootLogger = Logger;

  let rootServerLogger;

  const createFastifyLogger = (logger) => {
    const log = (severity, message, ...args) => {
      if (args.length > 0) {
        // eslint-disable-next-line no-console
        console.log('ADDITIONAL LOG ARGUMENTS: ', args);

        if (severity === 'error') {
          const [error] = args;
          if (!(error instanceof Error)) {
            logger.log({
              severity,
              message: 'Failed to log non-error object as error.',
            });
          }
          return;
        }

        throw new Error('Additional log arguments are not supported.');
      }

      if (typeof message === 'string') {
        logger.log({
          severity,
          message,
        });
        return;
      }

      logger.log({
        severity,
        ...message,
      });
    };

    return {
      level: options.severity,
      silent() { },
      info(message, ...args) {
        log('info', message, ...args);
      },
      warn(message, ...args) { log('warn', message, ...args); },
      error(message, ...args) { log('error', message, ...args); },
      fatal(message, ...args) { log('error', message, ...args); },
      trace(message, ...args) { log('debug', message, ...args); },
      debug(message, ...args) { log('debug', message, ...args); },
      child() { return rootServerLogger; }
    };
  };

  rootServerLogger = createFastifyLogger(rootLogger);
  rootServerLogger.debug('Server logger created');

  return rootServerLogger;
};

module.exports = { createServerLogger };
