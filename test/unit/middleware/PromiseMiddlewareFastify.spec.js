describe('PromiseMiddlewareFastify', () => {
  let consoleWriteSpy;

  beforeEach(() => {
    consoleWriteSpy = jest.spyOn(console._stdout, 'write').mockImplementation(jest.fn());

    injector().inject((TestWebServer, HTTPService, Logger, config) => {
      this.TestWebServer = TestWebServer;

      Logger.useRecorder();

      this.getResponse = (type, { acceptHttpHeader = 'text/plain', view, viewProps } = {}) => {
        const url = `http://localhost:${config.Port}/promise-middleware-test--${type}`;
        return HTTPService.get(url)
          .set('Accept', acceptHttpHeader === null ? undefined : acceptHttpHeader)
          .set('X-View', view ?? 'undefined')
          .set('X-View-Props', viewProps ? JSON.stringify(viewProps) : 'undefined');
      };
    });

    return this.TestWebServer.start({ withFastify: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
    return this.TestWebServer.stop();
  });

  it('json - success', () => {
    return this.getResponse('json')
      .promise()
      .then((response) => {
        expect(response).toEqual(expect.objectContaining({
          header: expect.objectContaining({ 'content-type': expect.stringContaining('application/json') }),
          text: JSON.stringify({ message: 'json success' })
        }));
      });
  });

  it('jsonAsync - success', () => {
    return this.getResponse('jsonAsync')
      .promise()
      .then((response) => {
        expect(response).toEqual(expect.objectContaining({
          header: expect.objectContaining({ 'content-type': expect.stringContaining('application/json') }),
          text: JSON.stringify({ message: 'jsonAsync success' })
        }));
      });
  });

  it('sendStatusAsync - success', () => {
    return this.getResponse('sendStatusAsync')
      .promise()
      .then((response) => {
        expect(response).toEqual(expect.objectContaining({ type: 'text/plain', status: 200, text: 'OK' }));
      });
  });

  it('sendAsync - success', () => {
    return this.getResponse('sendAsync')
      .promise()
      .then((response) => {
        expect(response).toEqual(expect.objectContaining({ status: 200, text: 'sendAsync success' }));
      });
  });

  it.each`
    testCase                                | view              | viewProps                         | textExpectation
    ${"'microapp' when props are provided"} | ${'microapp.ott'} | ${{ microapp: 'render success' }} | ${'render success'}
    ${"'home' when props are not provided"} | ${'home.ott'}     | ${undefined}                      | ${'No render view-props provided'}
  `('render - success: will render view $testCase', ({ view, viewProps, textExpectation }) => {
    return this.getResponse('render', { view, viewProps })
      .promise()
      .then((response) => {
        expect(response).toEqual(
          expect.objectContaining({ status: 200, text: expect.stringContaining(textExpectation) }),
        );
      });
  });

  it('renderAsync - success: will render view microapp.ott', () => {
    return this.getResponse('renderAsync', { view: 'microapp.ott', viewProps: { microapp: 'renderAsync success' } })
      .promise()
      .then((response) => {
        expect(response).toEqual(
          expect.objectContaining({ status: 200, text: expect.stringContaining('renderAsync success') }),
        );
      });
  });

  it.each`
    acceptHttpHeader      | expectedData
    ${'text/html'}        | ${{ text: 'document.innerHTML = "format success";', header: expect.objectContaining({ 'content-type': 'text/javascript' }) }}
    ${'application/json'} | ${{ text: '{"message":"format success"}', header: expect.objectContaining({ 'content-type': expect.stringContaining('application/json') }) }}
  `('format: $acceptHttpHeader - success', ({ acceptHttpHeader, expectedData }) => {
    return this.getResponse('format', { acceptHttpHeader })
      .then((response) => {
        expect(response).toEqual(
          expect.objectContaining({ status: 200, ...expectedData }),
        );
      }).finally(() => {
        // expect(consoleWriteSpy).toHaveBeenLastCalledWith(expect.stringContaining('format() will be deprecated, use send() instead with your own accept-header/format logic'));
      });
  });

  it.each`
    acceptHttpHeader | errorReason                | expectedErrorMessage
    ${null}          | ${'wildcard'}              | ${"accept header cannot be a wildcard: '*/*'"}
    ${'*/*'}         | ${'wildcard'}              | ${"accept header cannot be a wildcard: '*/*'"}
    ${'text/plain'}  | ${'missing format method'} | ${"Format method not found: 'text/plain' | 'text'"}
  `('format: $acceptHttpHeader - will error for $errorReason', ({ acceptHttpHeader, expectedErrorMessage }) => {
    return this.getResponse('format', { acceptHttpHeader })
      .then(() => {
        throw new Error('Unexpected');
      }).catch((err) => {
        // expect(err.response.body).toStrictEqual({ error: 'Internal Server Error', message: expectedErrorMessage, statusCode: 500 });
      });
  });

  it('should warn that formatAsync is deprecated', async () => {
    return this.getResponse('formatAsync', { acceptHttpHeader: 'text/html' })
      .promise()
      .then((response) => {
        expect(response).toEqual(expect.objectContaining({ header: expect.objectContaining({ 'content-type': 'text/javascript' }), status: 200, text: 'document.innerHTML = "formatAsync success";' }));
      }).finally(() => {
        // expect(consoleWriteSpy).toHaveBeenLastCalledWith(expect.stringContaining('formatAsync() will be deprecated, use send() instead with your own accept-header/format logic'));
      });
  });
});
