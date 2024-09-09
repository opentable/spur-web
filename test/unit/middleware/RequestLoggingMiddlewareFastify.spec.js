describe('RequestLoggingMiddlewareFastify', () => {
  let loggerLogSpy;

  const injectionMap = {};

  const getResponse = (path = '/') => {
    const url = `http://localhost:${injectionMap.config.Port}${path}`;
    return injectionMap.TestWebServer
      .start({ withFastify: true })
      .then(() => injectionMap.HTTPService.get(url));
  };

  beforeEach(() => {
    return injector().inject((config, TestWebServer, HTTPService, Logger) => {
      injectionMap.config = config;
      injectionMap.HTTPService = HTTPService;
      injectionMap.TestWebServer = TestWebServer;

      loggerLogSpy = jest.spyOn(Logger, 'log');

      Logger.useNoop();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    return injectionMap.TestWebServer.stop();
  });

  it('should log a completed request with json meta data', async () => {
    // Arrange
    injectionMap.config.WinstonWebLogging = { meta: true };

    // Act
    await getResponse();

    // Assert
    expect(loggerLogSpy).toHaveBeenLastCalledWith(
      'info',
      expect.stringMatching(/GET \/ 200 \d+ms/),
      {
        req: {
          headers: {
            'accept-encoding': 'gzip, deflate',
            connection: 'close',
            host: 'localhost:9088',
          },
          httpVersion: '1.1',
          method: 'GET',
          originalUrl: '/',
          query: {},
          url: '/',
        },
        res: { statusCode: 200 },
        responseTime: expect.any(Number)
      }
    );
  });

  it('should log a completed request WITHOUT json meta data', async () => {
    // Arrange
    injectionMap.config.WinstonWebLogging = { meta: false };

    // Act
    await getResponse();

    // Assert
    expect(loggerLogSpy).toHaveBeenLastCalledWith(
      'info',
      expect.stringMatching(/GET \/ 200 \d+ms/),
      {}
    );
  });

  it('should log a completed request WITHOUT json meta data', async () => {
    // Arrange
    injectionMap.config.WinstonWebLogging = { meta: true };

    // Act
    try {
      await getResponse('/with-error');
    } catch { }

    // Assert
    expect(loggerLogSpy).toHaveBeenLastCalledWith(
      'info',
      expect.stringMatching(/GET \/with-error 500 \d+ms/),
      {
        req: {
          headers: {
            'accept-encoding': 'gzip, deflate',
            connection: 'close',
            host: 'localhost:9088',
          },
          httpVersion: '1.1',
          method: 'GET',
          originalUrl: '/with-error',
          query: {},
          url: '/with-error',
        },
        res: { statusCode: 500 },
        responseTime: expect.any(Number)
      }
    );
  });
});
