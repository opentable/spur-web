describe('WinstonRequestLoggingMiddleware', function () {
  let expressWinstonLoggerSpy, loggerLogSpy;

  beforeEach(() => {
    this.MockPort = 9088;

    return injector().inject((WinstonRequestLoggingMiddleware, expressWinston, express,
      HTTPService, Logger, config, colors, TestWebServer) => {
      this.WinstonRequestLoggingMiddleware = WinstonRequestLoggingMiddleware;
      this.expressWinston = expressWinston;
      this.express = express;
      this.HTTPService = HTTPService;
      this.Logger = Logger;
      this.config = config;
      this.colors = colors;
      this.TestWebServer = TestWebServer;

      expressWinstonLoggerSpy = jest.spyOn(this.expressWinston, 'logger');
      loggerLogSpy = jest.spyOn(this.Logger, 'log');

      this.app = this.express();
      this.Logger.useNoop();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('configure() with defaults', () => {
    beforeEach(() => {
      this.WinstonRequestLoggingMiddleware.configure(this.app);
      this.instanceConfig = this.WinstonRequestLoggingMiddleware.config;
      this.options = this.WinstonRequestLoggingMiddleware.options;
    });

    it('should use empty config', () => {
      expect(this.instanceConfig).toStrictEqual({});
    });

    it('should use the logger as the winston instance', () => {
      expect(this.options.winstonInstance).toEqual(this.Logger);
    });

    it('should use default options', () => {
      expect(this.options).toEqual(expect.objectContaining(
        { meta: true, expressFormat: true, colorStatus: true }
      ));
    });

    it('should call expressWinston.logger with options', () => {
      expect(expressWinstonLoggerSpy).toHaveBeenCalledWith(this.options);
    });
  });

  describe('configure() with custom config', () => {
    beforeEach(() => {
      this.config.WinstonWebLogging = {
        meta: false,
        expressFormat: false,
        colorStatus: false,
        fakeOption: '123'
      };

      this.WinstonRequestLoggingMiddleware.configure(this.app);
      this.instanceConfig = this.WinstonRequestLoggingMiddleware.config;
      this.options = this.WinstonRequestLoggingMiddleware.options;
    });

    it('should use the logger as the winston instance', () => {
      expect(this.options.winstonInstance).toEqual(this.Logger);
    });

    it('should use custom options', () => {
      expect(this.options).toEqual(expect.objectContaining(
        { meta: false, expressFormat: false, colorStatus: false }
      ));
    });

    it('should add a non-default option', () => {
      expect(this.options.fakeOption).toBe('123');
    });

    it('should call expressWinston.logger with options', () => {
      expect(expressWinstonLoggerSpy).toHaveBeenCalledWith(this.options);
    });
  });

  describe('with request', () => {
    beforeEach(() => {
      this.startServer = () => {
        this.Logger.useRecorder();
        return this.TestWebServer.start();
      };
    });

    afterEach(() => {
      return this.TestWebServer.stop();
    });

    it('should log a winston request with json meta', () => {
      const expectedData = {
        req: {
          headers: {
            'accept-encoding': 'gzip, deflate',
            connection: 'close',
            host: 'localhost:9088'
          },
          httpVersion: '1.1',
          method: 'GET',
          originalUrl: '/',
          query: {},
          url: '/'
        },
        res: {
          statusCode: 200
        },
        responseTime: expect.any(Number)
      };

      return this.startServer().then(() => {
        return this.HTTPService.get('http://localhost:9088').promise().then((res) => {
          expect(loggerLogSpy).toHaveBeenLastCalledWith('info', expect.stringMatching(/GET \/ 200 \d+ms/), expectedData);
        });
      });
    });

    it('should log a winston request without meta', () => {
      this.config.WinstonWebLogging = { expressFormat: true, meta: false };

      return this.startServer().then(() => {
        return this.HTTPService.get('http://localhost:9088').promise().then((res) => {
          expect(loggerLogSpy).toHaveBeenLastCalledWith('info', expect.stringMatching('GET / 200'), {});
        });
      });
    });

    it('should log a winston request with meta for error', () => {
      this.config.WinstonWebLogging = { expressFormat: true, meta: false };

      return this.startServer().then(() => {
        return this.HTTPService.get('http://localhost:9088/with-error').promise().catch((res) => {
          expect(loggerLogSpy).toHaveBeenLastCalledWith('info', expect.stringMatching('GET /with-error 500'), {});
        });
      });
    });
  });
});
