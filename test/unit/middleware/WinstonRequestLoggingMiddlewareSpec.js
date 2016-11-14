/* eslint-disable no-unused-vars */

describe('WinstonRequestLoggingMiddleware', function () {
  beforeEach(() => {
    this.MockPort = 9088;

    injector().inject((WinstonRequestLoggingMiddleware, expressWinston, express,
      HTTPService, Logger, config, _, colors, TestWebServer) => {
      this.WinstonRequestLoggingMiddleware = WinstonRequestLoggingMiddleware;
      this.expressWinston = expressWinston;
      this.express = express;
      this.HTTPService = HTTPService;
      this.Logger = Logger;
      this.config = config;
      this._ = _;
      this.colors = colors;
      this.TestWebServer = TestWebServer;

      sinon.spy(this.expressWinston, 'logger');
      this.app = this.express();
      this.Logger.useNoop();
    });
  });

  afterEach(() => {
    return this.expressWinston.logger.restore();
  });

  describe('configure() with defaults', () => {
    beforeEach(() => {
      this.WinstonRequestLoggingMiddleware.configure(this.app);
      this.instanceConfig = this.WinstonRequestLoggingMiddleware.config;
      this.options = this.WinstonRequestLoggingMiddleware.options;
    });

    it('should use empty config', () => {
      expect(this.instanceConfig).to.deep.equal({});
    });

    it('should use the logger as the winston instance', () => {
      expect(this.options.winstonInstance).to.equal(this.Logger);
    });

    it('should use default options', () => {
      expect(this.options.meta).to.equal(true);
      expect(this.options.expressFormat).to.equal(true);
      expect(this.options.colorStatus).to.equal(true);
    });

    it('should call expressWinston.logger with options', () => {
      expect(this.expressWinston.logger.getCall(0).args[0]).to.deep.equal(this.options);
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
      expect(this.options.winstonInstance).to.equal(this.Logger);
    });

    it('should use custom options', () => {
      expect(this.options.meta).to.equal(false);
      expect(this.options.expressFormat).to.equal(false);
      expect(this.options.colorStatus).to.equal(false);
    });

    it('should add a non-default option', () => {
      expect(this.options.fakeOption).to.equal('123');
    });

    it('should call expressWinston.logger with options', () => {
      expect(this.expressWinston.logger.getCall(0).args[0]).to.deep.equal(this.options);
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
      return this.startServer().then(() => {
        return this.HTTPService.get('http://localhost:9088').promise().then((res) => {
          const lastEntry = this._.last(this.Logger.recorded.log);
          const message = this.colors.strip(lastEntry[1]);
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
      this.config.WinstonWebLogging = { expressFormat: true, meta: false };

      return this.startServer().then(() => {
        return this.HTTPService.get('http://localhost:9088').promise().then((res) => {
          const lastEntry = this._.last(this.Logger.recorded.log);
          const message = this.colors.strip(lastEntry[1]);
          const data = lastEntry[2];
          const expectedData = {};

          expect(lastEntry[0]).to.equal('info');
          expect(message).to.contain('GET / 200');
          expect(data).to.deep.equal(expectedData);
        });
      });
    });

    it('should log a winston request with meta for error', () => {
      this.config.WinstonWebLogging = { expressFormat: true, meta: false };

      return this.startServer().then(() => {
        return this.HTTPService.get('http://localhost:9088/with-error').promise().error((res) => {
          const lastEntry = this._.last(this.Logger.recorded.log);
          const message = this.colors.strip(lastEntry[1]);
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
