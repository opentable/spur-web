describe('BaseTestWebServer', function () {
  beforeEach(() => {
    injector().inject((TestWebServer, config, HTTPService, Logger) => {
      this.TestWebServer = TestWebServer;
      this.config = config;
      this.HTTPService = HTTPService;
      this.Logger = Logger;

      this.Logger.useRecorder();

      this.TestWebServer.start();
    });
  });

  afterEach(() => {
    this.TestWebServer.stop();
  });

  it('get index', (done) => {
    this.HTTPService
      .get('http://localhost:9088/')
      .promise()
      .then((res) => {
        expect(res.text).to.equal('SomeIndex');
        done();
      });
  });
});
