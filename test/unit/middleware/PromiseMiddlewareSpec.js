describe('PromiseMiddleware', function () {
  beforeEach(() => {
    injector().inject((TestWebServer, HTTPService, Logger, config) => {
      this.TestWebServer = TestWebServer;
      this.HTTPService = HTTPService;
      this.Logger = Logger;
      this.config = config;

      this.Logger.useRecorder();

      this.getResponse = (type) => {
        const url = `http://localhost:${this.config.Port}/promise-middleware-test--${type}`;
        return this.HTTPService.get(url);
      };

      return this.TestWebServer.start();
    });
  });

  afterEach(() => {
    return this.TestWebServer.stop();
  });

  it('jsonAsync - success', () => {
    return this.getResponse('jsonasync').promise().then((response) => {
      expect(response.type).to.equal('application/json');
      expect(response.body).to.equal('jsonAsync success');
    });
  });

  it('renderAsync - success', () => {
    return this.getResponse('renderasync').promise().then((response) => {
      expect(response.type).to.equal('text/html');
      expect(response.text).to.contain('renderView from ejs: renderAsync success');
    });
  });

  it('sendStatusAsync - success', () => {
    return this.getResponse('sendstatusasync').promise().then((response) => {
      expect(response.type).to.equal('text/plain');
      expect(response.status).to.equal(200);
      expect(response.text).to.equal('OK');
    });
  });
});
