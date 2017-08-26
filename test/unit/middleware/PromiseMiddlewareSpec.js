describe('PromiseMiddleware', function () {
  const base = this;

  beforeEach(() => {
    return injector().inject(function (TestWebServer, HTTPService, Logger, config) {
      base.TestWebServer = TestWebServer;
      base.HTTPService = HTTPService;
      base.Logger = Logger;
      base.config = config;

      base.Logger.useRecorder();

      base.getResponse = (type) => {
        const url = `http://localhost:${base.config.Port}/promise-middleware-test--${type}`;
        return base.HTTPService.get(url);
      };

      return base.TestWebServer.start();
    });
  });

  afterEach(() => {
    return base.TestWebServer.stop();
  });

  it('jsonAsync - success', () => {
    return base.getResponse('jsonasync').promise().then((response) => {
      expect(response.type).to.equal('application/json');
      expect(response.body).to.equal('jsonAsync success');
    });
  });

  it('renderAsync - success', () => {
    return base.getResponse('renderasync').promise().then((response) => {
      expect(response.type).to.equal('text/html');
      expect(response.text).to.contain('renderView from ejs: renderAsync success');
    });
  });

  it('sendStatusAsync - success', () => {
    return base.getResponse('sendstatusasync').promise().then((response) => {
      expect(response.type).to.equal('text/plain');
      expect(response.status).to.equal(200);
      expect(response.text).to.equal('OK');
    });
  });
});
