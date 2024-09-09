const { createServerLogger } = require('../../../src/fastify/FastifyLogger');

describe('FastifyLogger', () => {
  const injectionMap = {};

  let logger, loggerLogSpy;
  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(() => {
    injector().inject((Logger) => {
      Logger.useRecorder();

      logger = createServerLogger(Logger, { severity: 'debug' });
      loggerLogSpy = jest.spyOn(Logger, 'log');
      injectionMap.Logger = Logger;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    severity   | expectedSeverity
    ${'debug'} | ${'debug'}
    ${'info'}  | ${'info'}
    ${'warn'}  | ${'warn'}
    ${'error'} | ${'error'}
    ${'fatal'} | ${'error'}
    ${'trace'} | ${'debug'}
  `('should log $severity message', ({ severity, expectedSeverity }) => {
    // Act
    logger[severity](`${severity} message`);

    // Assert
    expect(loggerLogSpy).toHaveBeenLastCalledWith({ message: `${severity} message`, severity: expectedSeverity });
  });

  it('should log all name/value pairs when first argument is an object', () => {
    // Act
    logger.info({ testing: true });

    // Assert
    expect(loggerLogSpy).toHaveBeenLastCalledWith({ testing: true, severity: 'info' });
  });

  it('should throw an error when additional args are provided', () => {
    // Assert
    expect(() => {
      logger.info('message', 'additional', 'arg');
    }).toThrow('Additional log arguments are not supported.');
  });

  it('should log an error when logger.error is called without an Error object and additional args', () => {
    // Act
    logger.error('some error', 'additional', 'arg');

    // Assert
    expect(loggerLogSpy).toHaveBeenLastCalledWith({ message: 'Failed to log non-error object as error.', severity: 'error' });
  });

  it('should not invoke a logger method when logger.error is called with an Error-object as the first additional arg', () => {
    // Act
    logger.error('errored', new Error('some error'));

    // Assert
    expect(loggerLogSpy).not.toHaveBeenCalled();
  });

  it('should not invoke a logger method when logger.silent is called', () => {
    // Act
    logger.silent();

    // Assert
    expect(loggerLogSpy).not.toHaveBeenCalled();
  });

  it('should not invoke a logger method when logger.child is called an return the logger', () => {
    // Act
    const ogLogger = logger.child();

    // Assert
    expect(loggerLogSpy).not.toHaveBeenCalled();
    expect(ogLogger).toBe(logger);
  });
});
