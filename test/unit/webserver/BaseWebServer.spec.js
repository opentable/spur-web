describe('BaseTestWebServer', function () {

  beforeEach(() => {
    return injector().inject((TestWebServer, HTTPService, Logger) => {
      this.TestWebServer = TestWebServer;
      this.HTTPService = HTTPService;

      Logger.useRecorder();

      this.TestWebServer.setCluster({ worker: { id: 'some-cluster' } });

      const port = this.TestWebServer.getPort();
      expect(port).toBe(9088);

      this.TestWebServer.start();
    });
  });

  afterEach(() => {
    return this.TestWebServer.stop();
  });

  it('get index', (done) => {
    this.HTTPService
      .get('http://localhost:9088/')
      .promise()
      .then((res) => {
        expect(res.text).toBe('SomeIndex');
        done();
      });
  });
});
