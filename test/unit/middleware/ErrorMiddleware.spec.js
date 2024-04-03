describe('ErrorMiddleware', function () {
  let htmlErrorRenderRenderSpy,
    errorMiddlewareSendTextResponseSpy,
    errorMiddlewareSendHtmlResponseSpy,
    errorMiddlewareSendJsonResponseSpy,
    loggerErrorSpy;

  beforeEach(() => {
    injector().inject((ErrorMiddleware, HTTPService, TestWebServer, HtmlErrorRender, Logger, config) => {
      this.ErrorMiddleware = ErrorMiddleware;
      this.HTTPService = HTTPService;
      this.TestWebServer = TestWebServer;
      this.HtmlErrorRender = HtmlErrorRender;
      this.Logger = Logger;
      this.config = config;

      this.mockPort = 9080;

      htmlErrorRenderRenderSpy = jest.spyOn(this.HtmlErrorRender, 'render');
      errorMiddlewareSendTextResponseSpy = jest.spyOn(this.ErrorMiddleware, 'sendTextResponse');
      errorMiddlewareSendHtmlResponseSpy = jest.spyOn(this.ErrorMiddleware, 'sendHtmlResponse');
      errorMiddlewareSendJsonResponseSpy = jest.spyOn(this.ErrorMiddleware, 'sendJsonResponse');
      loggerErrorSpy = jest.spyOn(this.Logger, 'error');

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
          return this.HTTPService.get(url).set({ Accept: accept }).promise();
        });
      };

      this.assertError = (expectUrl) => {
        expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
        expect(loggerErrorSpy).toHaveBeenCalledWith(
          expect.any(Error),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          { url: expectUrl },
        );
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    return this.TestWebServer.stop();
  });

  describe('server errors with SpurErrors', () => {
    it('should attempt to render an html request', () => {
      return this.sendRequest('text/html', this.InternalServerError).catch((response) => {
        expect(response.statusCode).toBe(500);
        expect(errorMiddlewareSendHtmlResponseSpy).toHaveBeenCalled();
        expect(htmlErrorRenderRenderSpy).toHaveBeenCalled();
        this.assertError('/500-error-test');
      });
    });

    it('should attempt to render an json request', () => {
      return this.sendRequest('application/json', this.InternalServerError).catch((response) => {
        expect(response.statusCode).toBe(500);
        expect(errorMiddlewareSendJsonResponseSpy).toHaveBeenCalled();
        this.assertError('/500-error-test');
      });
    });

    it('should attempt to render an text request', () => {
      return this.sendRequest('text/plain', this.InternalServerError).catch((response) => {
        expect(response.statusCode).toBe(500);
        expect(errorMiddlewareSendTextResponseSpy).toHaveBeenCalled();
        this.assertError('/500-error-test');
      });
    });
  });

  describe('server errors with standard throw', () => {
    it('should attempt to render an html request', () => {
      return this.sendRequest('text/html', this.InternalServerStandardError).catch((response) => {
        expect(response.statusCode).toBe(500);
        expect(errorMiddlewareSendHtmlResponseSpy).toHaveBeenCalled();
        expect(htmlErrorRenderRenderSpy).toHaveBeenCalled();
        this.assertError('/500-standard-error-test');
      });
    });

    it('should attempt to render an json request', () => {
      return this.sendRequest('application/json', this.InternalServerStandardError).catch((response) => {
        expect(response.statusCode).toBe(500);
        expect(errorMiddlewareSendJsonResponseSpy).toHaveBeenCalled();
        this.assertError('/500-standard-error-test');
      });
    });

    it('should attempt to render an text request', () => {
      return this.sendRequest('text/plain', this.InternalServerStandardError).catch((response) => {
        expect(response.statusCode).toBe(500);
        expect(errorMiddlewareSendTextResponseSpy).toHaveBeenCalled();
        this.assertError('/500-standard-error-test');
      });
    });
  });

  describe('not found errors', () => {
    it('should attempt to render an html request', () => {
      return this.sendRequest('text/html', this.NotFoundError).catch((response) => {
        expect(response.statusCode).toBe(404);
        expect(errorMiddlewareSendHtmlResponseSpy).toHaveBeenCalled();
        expect(htmlErrorRenderRenderSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });

    it('should attempt to render an json request', () => {
      return this.sendRequest('application/json', this.NotFoundError).catch((response) => {
        expect(response.statusCode).toBe(404);
        expect(errorMiddlewareSendJsonResponseSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });

    it('should attempt to render an text request', () => {
      return this.sendRequest('text/plain', this.NotFoundError).catch((response) => {
        expect(response.statusCode).toBe(404);
        expect(errorMiddlewareSendTextResponseSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('not found errors from undefined', () => {
    it('should attempt to render an html request', () => {
      return this.sendRequest('text/html', this.NotFoundErrorUndefined).catch((response) => {
        expect(response.statusCode).toBe(404);
        expect(errorMiddlewareSendHtmlResponseSpy).toHaveBeenCalled();
        expect(htmlErrorRenderRenderSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });

    it('should attempt to render an json request', () => {
      return this.sendRequest('application/json', this.NotFoundErrorUndefined).catch((response) => {
        expect(response.statusCode).toBe(404);
        expect(errorMiddlewareSendJsonResponseSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });

    it('should attempt to render an text request', () => {
      return this.sendRequest('text/plain', this.NotFoundErrorUndefined).catch((response) => {
        expect(response.statusCode).toBe(404);
        expect(errorMiddlewareSendTextResponseSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });
  });
});
