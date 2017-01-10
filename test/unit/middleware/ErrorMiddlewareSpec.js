describe('ErrorMiddleware', function () {
  beforeEach(() => {
    injector().inject((ErrorMiddleware, HTTPService,
      TestWebServer, HtmlErrorRender, Logger, config, _) => {
      this.ErrorMiddleware = ErrorMiddleware;
      this.HTTPService = HTTPService;
      this.TestWebServer = TestWebServer;
      this.HtmlErrorRender = HtmlErrorRender;
      this.Logger = Logger;
      this.config = config;
      this._ = _;

      this.mockPort = 9080;

      sinon.spy(this.HtmlErrorRender, 'render');
      sinon.spy(this.ErrorMiddleware, 'sendTextResponse');
      sinon.spy(this.ErrorMiddleware, 'sendHtmlResponse');
      sinon.spy(this.ErrorMiddleware, 'sendJsonResponse');

      const host = `http://localhost:${this.mockPort}`;
      this.InternalServerError = `${host}/500-error-test`;
      this.InternalServerStandardError = `${host}/500-standard-error-test`;
      this.NotFoundError = `${host}/404-error-test`;
      this.NotFoundErrorUndefined = `${host}/cant-find-this-path`;

      this.startServerOnPort = (port) => {
        this.config.Port = port;
        this.Logger.useRecorder();
        return this.TestWebServer.start();
      };

      this.sendRequest = (accept, url) => {
        return this.startServerOnPort(this.mockPort).then(() => {
          return this.HTTPService.get(url)
            .set({ Accept: accept })
            .promise();
        });
      };

      this.assertError = (expectUrl) => {
        const lastCall = this._.last(this.Logger.recorded.error);
        expect(lastCall[4].url).to.equal(expectUrl);
      };
    });
  });

  afterEach(() => {
    return this.TestWebServer.stop();
  });

  describe('server errors with SpurErrors', () => {
    it('should attempt to render an html request', () => {
      return this.sendRequest('text/html', this.InternalServerError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(this.ErrorMiddleware.sendHtmlResponse.called).to.equal(true);
        expect(this.HtmlErrorRender.render.called).to.equal(true);
        this.assertError('/500-error-test');
      });
    });

    it('should attempt to render an json request', () => {
      return this.sendRequest('application/json', this.InternalServerError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(this.ErrorMiddleware.sendJsonResponse.called).to.equal(true);
        this.assertError('/500-error-test');
      });
    });

    it('should attempt to render an text request', () => {
      return this.sendRequest('text/plain', this.InternalServerError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(this.ErrorMiddleware.sendTextResponse.called).to.equal(true);
        this.assertError('/500-error-test');
      });
    });
  });

  describe('server errors with standard throw', () => {
    it('should attempt to render an html request', () => {
      return this.sendRequest('text/html', this.InternalServerStandardError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(this.ErrorMiddleware.sendHtmlResponse.called).to.equal(true);
        expect(this.HtmlErrorRender.render.called).to.equal(true);
        this.assertError('/500-standard-error-test');
      });
    });

    it('should attempt to render an json request', () => {
      return this.sendRequest('application/json', this.InternalServerStandardError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(this.ErrorMiddleware.sendJsonResponse.called).to.equal(true);
        this.assertError('/500-standard-error-test');
      });
    });

    it('should attempt to render an text request', () => {
      return this.sendRequest('text/plain', this.InternalServerStandardError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(this.ErrorMiddleware.sendTextResponse.called).to.equal(true);
        this.assertError('/500-standard-error-test');
      });
    });
  });

  describe('not found errors', () => {
    it('should attempt to render an html request', () => {
      return this.sendRequest('text/html', this.NotFoundError).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(this.ErrorMiddleware.sendHtmlResponse.called).to.equal(true);
        expect(this.HtmlErrorRender.render.called).to.equal(true);
        expect(this.Logger.recorded.error).to.not.exist;
      });
    });

    it('should attempt to render an json request', () => {
      return this.sendRequest('application/json', this.NotFoundError).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(this.ErrorMiddleware.sendJsonResponse.called).to.equal(true);
        expect(this.Logger.recorded.error).to.not.exist;
      });
    });

    it('should attempt to render an text request', () => {
      return this.sendRequest('text/plain', this.NotFoundError).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(this.ErrorMiddleware.sendTextResponse.called).to.equal(true);
        expect(this.Logger.recorded.error).to.not.exist;
      });
    });
  });

  describe('not found errors from undefined', () => {
    it('should attempt to render an html request', () => {
      return this.sendRequest('text/html', this.NotFoundErrorUndefined).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(this.ErrorMiddleware.sendHtmlResponse.called).to.equal(true);
        expect(this.HtmlErrorRender.render.called).to.equal(true);
        expect(this.Logger.recorded.error).to.not.exist;
      });
    });

    it('should attempt to render an json request', () => {
      return this.sendRequest('application/json', this.NotFoundErrorUndefined).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(this.ErrorMiddleware.sendJsonResponse.called).to.equal(true);
        expect(this.Logger.recorded.error).to.not.exist;
      });
    });

    it('should attempt to render an text request', () => {
      return this.sendRequest('text/plain', this.NotFoundErrorUndefined).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(this.ErrorMiddleware.sendTextResponse.called).to.equal(true);
        expect(this.Logger.recorded.error).to.not.exist;
      });
    });
  });
});
