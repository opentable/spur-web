describe('BaseWebServer', function () {
  beforeEach(() => {
    injector().inject((WebServer, config, HTTPService, Logger) => {
      this.WebServer = WebServer;
      this.config = config;
      this.HTTPService = HTTPService;
      this.Logger = Logger;

      this.Logger.useRecorder();

      this.WebServer.start();
    });
  });

  afterEach(() => {
    this.WebServer.stop();
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
