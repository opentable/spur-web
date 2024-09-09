describe('FastifyWebServer', () => {
  let originalPort;

  beforeEach(async () => {
    injector().inject(async (config, TestWebServer, HTTPService, Logger, FastifyWebServer) => {
      this.config = config;
      this.TestWebServer = TestWebServer;
      this.HTTPService = HTTPService;
      this.FastifyWebServer = FastifyWebServer;

      originalPort = config.Port;

      Logger.useRecorder();

      this.TestWebServer.setCluster({ worker: { id: 'some-cluster' } });
    });

    this.TestWebServer = await this.TestWebServer.start({ withFastify: true });
    const port = this.TestWebServer.getPort();
    expect(port).toBe(9088);
  });

  afterEach(() => {
    this.config.Port = originalPort;
    return this.TestWebServer.stop();
  });

  it('get index', async () => {
    return this.HTTPService.get('http://localhost:9088/')
      .promise()
      .then((res) => {
        expect(res.text).toBe('SomeIndex');
      });
  });

  it('should call create when start is called', () => {
    // Arrange
    this.config.Port = originalPort + 1;
    const fastifyWebServerCreateSpy = jest.spyOn(this.FastifyWebServer.prototype, 'create');

    // Act
    return new this.FastifyWebServer().start({ withFastify: true }).then(({ webServer }) => {
      // Assert
      expect(fastifyWebServerCreateSpy).toHaveBeenCalled();
      webServer.stop();
    });
  });

  it('should return value of config.port if webserver has not been started', () => {
    // Act
    const port = new this.FastifyWebServer().getPort();

    // Assert
    expect(port).toBe(originalPort);
  });
});
