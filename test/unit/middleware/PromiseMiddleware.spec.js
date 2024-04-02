describe('PromiseMiddleware', function () {

  beforeEach(() => {
    return injector().inject((TestWebServer, HTTPService, Logger, config) => {
      this.TestWebServer = TestWebServer;

      Logger.useRecorder();

      this.getResponse = (type) => {
        const url = `http://localhost:${config.Port}/promise-middleware-test--${type}`;
        return HTTPService.get(url);
      };

      return this.TestWebServer.start();
    });
  });

  afterEach(() => {
    return this.TestWebServer.stop();
  });

  it('jsonAsync - success', () => {
    return this.getResponse('jsonasync').promise().then((response) => {
      expect(response).toEqual(expect.objectContaining(
        { type: 'application/json', body: 'jsonAsync success' }
      ));
    });
  });

  it('sendStatusAsync - success', () => {
    return this.getResponse('sendstatusasync').promise().then((response) => {
      expect(response).toEqual(expect.objectContaining(
        { type: 'text/plain', status: 200, text: 'OK' }
      ));
    });
  });
});
