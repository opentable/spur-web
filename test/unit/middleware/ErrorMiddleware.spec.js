describe.each`
  server       | withFastify
  ${'express'} | ${false}
  ${'fastify'} | ${true}
`('ErrorMiddleware for $server server', ({ withFastify }) => {
  let htmlErrorRenderRenderSpy, errorMiddlewareSendTextResponseSpy, errorMiddlewareSendHtmlResponseSpy, errorMiddlewareSendJsonResponseSpy, loggerErrorSpy;

  const mockPort = 9080;
  const host = `http://localhost:${mockPort}`;
  const urlInternalServerError = `${host}/500-error-test`;
  const urlInternalServerStandardError = `${host}/500-standard-error-test`;
  const urlNotFoundError = `${host}/404-error-test`;
  const urlNotFoundErrorUndefined = `${host}/cant-find-this-path`;

  const sendRequest = (accept, url) => {
    return this.HTTPService.get(url)
      .set({ Accept: accept })
      .promise();
  };

  const assertError = (expectUrl) => {
    expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      { url: expectUrl },
    );
  };

  beforeEach(() => {
    injector().inject((ErrorMiddleware, ErrorMiddlewareFastify, HTTPService, TestWebServer, HtmlErrorRender, Logger, config) => {
      this.ErrorMiddleware = withFastify ? ErrorMiddlewareFastify : ErrorMiddleware;
      this.HTTPService = HTTPService;
      this.TestWebServer = TestWebServer;
      this.config = config;

      Logger.useNoop();

      htmlErrorRenderRenderSpy = jest.spyOn(HtmlErrorRender, 'render');
      errorMiddlewareSendTextResponseSpy = jest.spyOn(this.ErrorMiddleware, 'sendTextResponse');
      errorMiddlewareSendHtmlResponseSpy = jest.spyOn(this.ErrorMiddleware, 'sendHtmlResponse');
      errorMiddlewareSendJsonResponseSpy = jest.spyOn(this.ErrorMiddleware, 'sendJsonResponse');
      loggerErrorSpy = jest.spyOn(Logger, 'error');
    });

    this.config.Port = mockPort;
    return this.TestWebServer.start({ withFastify });
  });

  afterEach(() => {
    jest.clearAllMocks();
    return this.TestWebServer.stop();
  });

  describe('server errors with SpurErrors', () => {
    it('should attempt to render an html request', () => {
      return sendRequest('text/html', urlInternalServerError).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 500,
          data: expect.stringMatching(/Error: Some dumb server error\s+at Object.create \(/)
        }));
        expect(errorMiddlewareSendHtmlResponseSpy).toHaveBeenCalled();
        expect(htmlErrorRenderRenderSpy).toHaveBeenCalled();
        assertError('/500-error-test');
      });
    });

    it('should attempt to render an json request', () => {
      return sendRequest('application/json', urlInternalServerError).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 500,
          data: { error: 'Some dumb server error', data: { url: '/500-error-test' } }
        }));
        expect(errorMiddlewareSendJsonResponseSpy).toHaveBeenCalled();
        assertError('/500-error-test');
      });
    });

    it('should attempt to render an text request', () => {
      return sendRequest('text/plain', urlInternalServerError).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 500,
          data: 'Some dumb server error'
        }));
        expect(errorMiddlewareSendTextResponseSpy).toHaveBeenCalled();
        assertError('/500-error-test');
      });
    });
  });

  describe('server errors with standard throw', () => {
    it('should attempt to render an html request', () => {
      return sendRequest('text/html', urlInternalServerStandardError).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 500,
          data: expect.stringMatching(/Error: Internal Server Error\s+at Object.create \(/)
        }));
        expect(errorMiddlewareSendHtmlResponseSpy).toHaveBeenCalled();
        expect(htmlErrorRenderRenderSpy).toHaveBeenCalled();
        assertError('/500-standard-error-test');
      });
    });

    it('should attempt to render an json request', () => {
      return sendRequest('application/json', urlInternalServerStandardError).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 500,
          data: {
            error: 'Internal Server Error',
            data: { url: '/500-standard-error-test' }
          }
        }));
        expect(errorMiddlewareSendJsonResponseSpy).toHaveBeenCalled();
        assertError('/500-standard-error-test');
      });
    });

    it('should attempt to render an text request', () => {
      return sendRequest('text/plain', urlInternalServerStandardError).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 500,
          data: 'Internal Server Error'
        }));
        expect(errorMiddlewareSendTextResponseSpy).toHaveBeenCalled();
        assertError('/500-standard-error-test');
      });
    });
  });

  describe('not found errors', () => {
    it('should attempt to render an html request', () => {
      return sendRequest('text/html', urlNotFoundError).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 404,
          data: expect.stringMatching(/Error: Some dumb not found error\s+at Object.create \(/)
        }));
        expect(errorMiddlewareSendHtmlResponseSpy).toHaveBeenCalled();
        expect(htmlErrorRenderRenderSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });

    it('should attempt to render an json request', () => {
      return sendRequest('application/json', urlNotFoundError).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 404,
          data: {
            error: 'Some dumb not found error',
            data: { url: '/404-error-test' }
          }
        }));

        expect(errorMiddlewareSendJsonResponseSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });

    it('should attempt to render an text request', () => {
      return sendRequest('text/plain', urlNotFoundError).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 404,
          data: 'Some dumb not found error',
        }));
        expect(errorMiddlewareSendTextResponseSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('not found errors from undefined', () => {
    it('should attempt to render an html request', () => {
      return sendRequest('text/html', urlNotFoundErrorUndefined).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 404,
          data: expect.stringMatching(/Error: Not Found\s+at Object.create \(/),
        }));
        expect(errorMiddlewareSendHtmlResponseSpy).toHaveBeenCalled();
        expect(htmlErrorRenderRenderSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });

    it('should attempt to render an json request', () => {
      return sendRequest('application/json', urlNotFoundErrorUndefined).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 404,
          data: { error: 'Not Found', data: { url: '/cant-find-this-path' } }
        }));
        expect(errorMiddlewareSendJsonResponseSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });

    it('should attempt to render an text request', () => {
      return sendRequest('text/plain', urlNotFoundErrorUndefined).catch((response) => {
        expect(response).toStrictEqual(expect.objectContaining({
          statusCode: 404,
          data: 'Not Found'
        }));
        expect(errorMiddlewareSendTextResponseSpy).toHaveBeenCalled();
        expect(loggerErrorSpy).not.toHaveBeenCalled();
      });
    });
  });

  it("should not throw an error when logErrorStack is called without error argument and log 'empty' error", () => {
    this.ErrorMiddleware.logErrorStack();

    expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
    expect(loggerErrorSpy).toHaveBeenCalledWith({}, '\n', '', '\n', '');
  });

  it('should log 404 error when EXCLUDE_STATUSCODE_FROM_LOGS is overridden', () => {
    this.ErrorMiddleware.EXCLUDE_STATUSCODE_FROM_LOGS = null;

    return sendRequest('text/html', urlNotFoundError).catch((response) => {
      expect(response.statusCode).toBe(404);
      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });
});
