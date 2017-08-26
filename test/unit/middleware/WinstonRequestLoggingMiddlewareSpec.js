const _last = require('lodash.last');

describe('WinstonRequestLoggingMiddleware', function () {
  const base = this;

  beforeEach(() => {
    base.MockPort = 9088;

    injector().inject(function (WinstonRequestLoggingMiddleware, expressWinston, express,
      HTTPService, Logger, config, colors, TestWebServer) {
      base.WinstonRequestLoggingMiddleware = WinstonRequestLoggingMiddleware;
      base.expressWinston = expressWinston;
      base.express = express;
      base.HTTPService = HTTPService;
      base.Logger = Logger;
      base.config = config;
      base.colors = colors;
      base.TestWebServer = TestWebServer;

      sinon.spy(base.expressWinston, 'logger');
      base.app = base.express();
      base.Logger.useNoop();
    });
  });

  afterEach(() => {
    return base.expressWinston.logger.restore();
  });

  describe('configure() with defaults', () => {
    beforeEach(() => {
      base.WinstonRequestLoggingMiddleware.configure(base.app);
      base.instanceConfig = base.WinstonRequestLoggingMiddleware.config;
      base.options = base.WinstonRequestLoggingMiddleware.options;
    });

    it('should use empty config', () => {
      expect(base.instanceConfig).to.deep.equal({});
    });

    it('should use the logger as the winston instance', () => {
      expect(base.options.winstonInstance).to.equal(base.Logger);
    });

    it('should use default options', () => {
      expect(base.options.meta).to.equal(true);
      expect(base.options.expressFormat).to.equal(true);
      expect(base.options.colorStatus).to.equal(true);
    });

    it('should call expressWinston.logger with options', () => {
      expect(base.expressWinston.logger.getCall(0).args[0]).to.deep.equal(base.options);
    });
  });

  describe('configure() with custom config', () => {
    beforeEach(() => {
      base.config.WinstonWebLogging = {
        meta: false,
        expressFormat: false,
        colorStatus: false,
        fakeOption: '123'
      };

      base.WinstonRequestLoggingMiddleware.configure(base.app);
      base.instanceConfig = base.WinstonRequestLoggingMiddleware.config;
      base.options = base.WinstonRequestLoggingMiddleware.options;
    });

    it('should use the logger as the winston instance', () => {
      expect(base.options.winstonInstance).to.equal(base.Logger);
    });

    it('should use custom options', () => {
      expect(base.options.meta).to.equal(false);
      expect(base.options.expressFormat).to.equal(false);
      expect(base.options.colorStatus).to.equal(false);
    });

    it('should add a non-default option', () => {
      expect(base.options.fakeOption).to.equal('123');
    });

    it('should call expressWinston.logger with options', () => {
      expect(base.expressWinston.logger.getCall(0).args[0]).to.deep.equal(base.options);
    });
  });

  describe('with request', () => {
    beforeEach(() => {
      base.startServer = () => {
        base.Logger.useRecorder();
        return base.TestWebServer.start();
      };
    });

    afterEach(() => {
      return base.TestWebServer.stop();
    });

    it('should log a winston request with json meta', () => {
      return base.startServer().then(() => {
        return base.HTTPService.get('http://localhost:9088').promise().then((res) => {
          const lastEntry = _last(base.Logger.recorded.log);
          const message = base.colors.strip(lastEntry[1]);
          const data = lastEntry[2];

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
            responseTime: data.responseTime
          };

          delete data.req.headers['user-agent'];

          expect(lastEntry[0]).to.equal('info');
          expect(message).to.equal(`GET / 200 ${data.responseTime}ms`);
          expect(data).to.deep.equal(expectedData);
        });
      });
    });

    it('should log a winston request without meta', () => {
      base.config.WinstonWebLogging = { expressFormat: true, meta: false };

      return base.startServer().then(() => {
        return base.HTTPService.get('http://localhost:9088').promise().then((res) => {
          const lastEntry = _last(base.Logger.recorded.log);
          const message = base.colors.strip(lastEntry[1]);
          const data = lastEntry[2];
          const expectedData = {};

          expect(lastEntry[0]).to.equal('info');
          expect(message).to.contain('GET / 200');
          expect(data).to.deep.equal(expectedData);
        });
      });
    });

    it('should log a winston request with meta for error', () => {
      base.config.WinstonWebLogging = { expressFormat: true, meta: false };

      return base.startServer().then(() => {
        return base.HTTPService.get('http://localhost:9088/with-error').promise().catch((res) => {
          const lastEntry = _last(base.Logger.recorded.log);
          const message = base.colors.strip(lastEntry[1]);
          const data = lastEntry[2];
          const expectedData = {};

          expect(lastEntry[0]).to.equal('info');
          expect(message).to.contain('GET /with-error 500');
          expect(data).to.deep.equal(expectedData);
        });
      });
    });
  });
});
