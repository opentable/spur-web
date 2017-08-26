const _last = require('lodash.last');

describe('ErrorMiddleware', function () {
  const base = this;

  beforeEach(() => {
    injector().inject(function (ErrorMiddleware, HTTPService,
      TestWebServer, HtmlErrorRender, Logger, config) {
      base.ErrorMiddleware = ErrorMiddleware;
      base.HTTPService = HTTPService;
      base.TestWebServer = TestWebServer;
      base.HtmlErrorRender = HtmlErrorRender;
      base.Logger = Logger;
      base.config = config;

      base.mockPort = 9080;

      sinon.spy(base.HtmlErrorRender, 'render');
      sinon.spy(base.ErrorMiddleware, 'sendTextResponse');
      sinon.spy(base.ErrorMiddleware, 'sendHtmlResponse');
      sinon.spy(base.ErrorMiddleware, 'sendJsonResponse');

      const host = `http://localhost:${base.mockPort}`;
      base.InternalServerError = `${host}/500-error-test`;
      base.InternalServerStandardError = `${host}/500-standard-error-test`;
      base.NotFoundError = `${host}/404-error-test`;
      base.NotFoundErrorUndefined = `${host}/cant-find-this-path`;

      base.startServerOnPort = (port) => {
        base.config.Port = port;
        base.Logger.useRecorder();
        return base.TestWebServer.start();
      };

      base.sendRequest = (accept, url) => {
        return base.startServerOnPort(base.mockPort).then(() => {
          return base.HTTPService.get(url)
            .set({ Accept: accept })
            .promise();
        });
      };

      base.assertError = (expectUrl) => {
        const lastCall = _last(base.Logger.recorded.error);
        expect(lastCall[4].url).to.equal(expectUrl);
      };
    });
  });

  afterEach(() => {
    return base.TestWebServer.stop();
  });

  describe('server errors with SpurErrors', () => {
    it('should attempt to render an html request', () => {
      return base.sendRequest('text/html', base.InternalServerError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(base.ErrorMiddleware.sendHtmlResponse.called).to.equal(true);
        expect(base.HtmlErrorRender.render.called).to.equal(true);
        base.assertError('/500-error-test');
      });
    });

    it('should attempt to render an json request', () => {
      return base.sendRequest('application/json', base.InternalServerError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(base.ErrorMiddleware.sendJsonResponse.called).to.equal(true);
        base.assertError('/500-error-test');
      });
    });

    it('should attempt to render an text request', () => {
      return base.sendRequest('text/plain', base.InternalServerError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(base.ErrorMiddleware.sendTextResponse.called).to.equal(true);
        base.assertError('/500-error-test');
      });
    });
  });

  describe('server errors with standard throw', () => {
    it('should attempt to render an html request', () => {
      return base.sendRequest('text/html', base.InternalServerStandardError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(base.ErrorMiddleware.sendHtmlResponse.called).to.equal(true);
        expect(base.HtmlErrorRender.render.called).to.equal(true);
        base.assertError('/500-standard-error-test');
      });
    });

    it('should attempt to render an json request', () => {
      return base.sendRequest('application/json', base.InternalServerStandardError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(base.ErrorMiddleware.sendJsonResponse.called).to.equal(true);
        base.assertError('/500-standard-error-test');
      });
    });

    it('should attempt to render an text request', () => {
      return base.sendRequest('text/plain', base.InternalServerStandardError).catch((response) => {
        expect(response.statusCode).to.equal(500);
        expect(base.ErrorMiddleware.sendTextResponse.called).to.equal(true);
        base.assertError('/500-standard-error-test');
      });
    });
  });

  describe('not found errors', () => {
    it('should attempt to render an html request', () => {
      return base.sendRequest('text/html', base.NotFoundError).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(base.ErrorMiddleware.sendHtmlResponse.called).to.equal(true);
        expect(base.HtmlErrorRender.render.called).to.equal(true);
        expect(base.Logger.recorded.error).to.not.exist;
      });
    });

    it('should attempt to render an json request', () => {
      return base.sendRequest('application/json', base.NotFoundError).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(base.ErrorMiddleware.sendJsonResponse.called).to.equal(true);
        expect(base.Logger.recorded.error).to.not.exist;
      });
    });

    it('should attempt to render an text request', () => {
      return base.sendRequest('text/plain', base.NotFoundError).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(base.ErrorMiddleware.sendTextResponse.called).to.equal(true);
        expect(base.Logger.recorded.error).to.not.exist;
      });
    });
  });

  describe('not found errors from undefined', () => {
    it('should attempt to render an html request', () => {
      return base.sendRequest('text/html', base.NotFoundErrorUndefined).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(base.ErrorMiddleware.sendHtmlResponse.called).to.equal(true);
        expect(base.HtmlErrorRender.render.called).to.equal(true);
        expect(base.Logger.recorded.error).to.not.exist;
      });
    });

    it('should attempt to render an json request', () => {
      return base.sendRequest('application/json', base.NotFoundErrorUndefined).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(base.ErrorMiddleware.sendJsonResponse.called).to.equal(true);
        expect(base.Logger.recorded.error).to.not.exist;
      });
    });

    it('should attempt to render an text request', () => {
      return base.sendRequest('text/plain', base.NotFoundErrorUndefined).catch((response) => {
        expect(response.statusCode).to.equal(404);
        expect(base.ErrorMiddleware.sendTextResponse.called).to.equal(true);
        expect(base.Logger.recorded.error).to.not.exist;
      });
    });
  });
});
