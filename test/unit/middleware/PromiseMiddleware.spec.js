describe('PromiseMiddleware', function () {
  beforeEach(() => {
    return injector().inject((TestWebServer, HTTPService, Logger, config) => {
      this.TestWebServer = TestWebServer;

      Logger.useRecorder();

      this.getResponse = (type, { acceptHttpHeader = 'text/plain', view, viewProps } = {}) => {
        const url = `http://localhost:${config.Port}/promise-middleware-test--${type}`;
        return HTTPService.get(url)
          .set('Accept', acceptHttpHeader)
          .set('X-View', view ?? 'undfined')
          .set('X-View-Props', viewProps ? JSON.stringify(viewProps) : 'undefined');
      };

      return this.TestWebServer.start();
    });
  });

  afterEach(() => {
    return this.TestWebServer.stop();
  });

  it('jsonAsync - success', () => {
    return this.getResponse('jsonAsync')
      .promise()
      .then((response) => {
        expect(response).toEqual(expect.objectContaining({ type: 'application/json', body: 'jsonAsync success' }));
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
    testCase                                | view              | viewProps                              | textExpectation
    ${"'microapp' when props are provided"} | ${'microapp.ott'} | ${{ microapp: 'renderAsync success' }} | ${'renderAsync success'}
    ${"'home' when props are not provided"} | ${'home.ott'}     | ${undefined}                           | ${'No render view-props provided'}
  `('renderAsync - success: will render view $testCase', ({ view, viewProps, textExpectation }) => {
    return this.getResponse('renderAsync', { view, viewProps })
      .promise()
      .then((response) => {
        expect(response).toEqual(
          expect.objectContaining({ status: 200, text: expect.stringContaining(textExpectation) }),
        );
      });
  });

  it.each`
    acceptHttpHeader      | expectedData
    ${'text/html'}        | ${{ text: 'document.innerHTML = "formatAsync success";', type: 'text/javascript' }}
    ${'application/json'} | ${{ text: '"formatAsync success"' }}
  `('formatAsync: $acceptHttpHeader - success', ({ acceptHttpHeader, expectedData }) => {
    return this.getResponse('formatAsync', { acceptHttpHeader })
      .promise()
      .then((response) => {
        expect(response).toEqual(expect.objectContaining({ status: 200, ...expectedData }));
      });
  });
});
