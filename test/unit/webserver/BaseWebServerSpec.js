describe('BaseTestWebServer', function () {
  const base = this;

  beforeEach(() => {
    injector().inject(function (TestWebServer, config, HTTPService, Logger) {
      base.TestWebServer = TestWebServer;
      base.config = config;
      base.HTTPService = HTTPService;
      base.Logger = Logger;

      base.Logger.useRecorder();

      base.TestWebServer.start();
    });
  });

  afterEach(() => {
    base.TestWebServer.stop();
  });

  it('get index', (done) => {
    base.HTTPService
      .get('http://localhost:9088/')
      .promise()
      .then((res) => {
        expect(res.text).to.equal('SomeIndex');
        done();
      });
  });
});
