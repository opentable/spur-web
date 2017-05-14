describe('BaseTestWebServer', function () {
  describe('HTTP Only', () => {
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

    it('get index on http', (done) => {
      this.HTTPService
        .get('http://localhost:9088/')
        .promise()
        .then((res) => {
          expect(res.text).to.equal('SomeIndex');
          done();
        });
    });

    it('check https is not running', (done) => {
      this.HTTPService
        .get('https://localhost:9099/')
        .promise()
        .catch((error) => {
          expect(error).to.exist;
          done();
        });
    });
  });

  describe('HTTPS Enabled', () => {
    beforeEach(() => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

      injector()
        .addResolvableDependency('config', (() => ({
          Port: 9088,
          RootWebPath: '~/Documents/Opentable/spur-web',

          Https: {
            Port: 9099,
            PrivateKeyFilePath: 'test/fixtures/certificates/server.key',
            CertificateFilePath: 'test/fixtures/certificates/server.crt'
          }
        })), true)
        .inject((TestWebServer, config, HTTPService, Logger) => {
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

    it('get index on http', (done) => {
      this.HTTPService
        .get('http://localhost:9088/')
        .promise()
        .then((res) => {
          expect(res.text).to.equal('SomeIndex');
          done();
        });
    });

    it('get index on https', (done) => {
      this.HTTPService
        .get('https://localhost:9099/')
        .promise()
        .then((res) => {
          expect(res.text).to.equal('SomeIndex');
          done();
        });
    });
  });
});
