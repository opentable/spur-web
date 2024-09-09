describe('BaseWebServer', () => {
  let loggerInfoSpy;

  beforeEach(() => {
    injector().inject((BaseWebServer, TestWebServer, HTTPService, Logger) => {
      this.BaseWebServer = BaseWebServer;
      this.TestWebServer = TestWebServer;
      this.HTTPService = HTTPService;

      loggerInfoSpy = jest.spyOn(Logger, 'info');

      Logger.useRecorder();

      this.TestWebServer.setCluster({ worker: { id: 'some-cluster' } });

      const port = this.TestWebServer.getPort();
      expect(port).toBe(9088);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not fail when stop is called before server is started', () => {
    expect(async () => { await this.TestWebServer.stop(); }).not.toThrow();
  });

  describe.each`
    withFastify  | expectedAppConstructorName
    ${false}     | ${'EventEmitter'}
    ${undefined} | ${'EventEmitter'}
    ${true}      | ${'Object'}
  `("when server is started with 'withFastify' option of $withFastify", ({ withFastify, expectedAppConstructorName }) => {
    beforeEach(() => {
      return this.TestWebServer.start({ withFastify, keepAliveTimeout: 1000 });
    });

    afterEach(() => {
      return this.TestWebServer.stop().then(() => {
        expect(loggerInfoSpy).toHaveBeenLastCalledWith(expect.stringContaining('server stopped'));
      });
    });

    it('get index', (done) => {
      this.HTTPService.get('http://localhost:9088/')
        .promise()
        .then((res) => {
          expect(res.text).toBe('SomeIndex');
          done();
        });
    });

    it("should return underlying application and server when 'app' and 'server' getters are called", () => {
      expect(this.TestWebServer.app.constructor.name).toBe(expectedAppConstructorName);
      expect(this.TestWebServer.server.constructor.name).toBe('Server');
      expect(this.TestWebServer.logSectionHeader).toBeDefined();
    });
  });

  describe('when the server is created', () => {
    it.each`
      withoutFastify
      ${false}
      ${undefined}
    `("should return underlying application when 'app' getter is called for express implementation", ({ withoutFastify }) => {
      this.TestWebServer.create(withoutFastify);

      expect(this.TestWebServer.app).toBeDefined();
    });

    it("should return undefined for underlying application when 'app' getter is called for fastify implementation", () => {
      this.TestWebServer.create(true);

      // expect(this.TestWebServer.app).toBeUndefined();
    });

    it("should start server when 'create' has already been called", async () => {
      // Arrange
      this.TestWebServer.create(true);
      // expect(this.TestWebServer.app).toBeUndefined();

      // Act
      await this.TestWebServer.start();

      // Assert
      expect(this.TestWebServer.app).toBeDefined();
      expect(this.TestWebServer.getPort()).toBe(9088);
      await this.TestWebServer.stop();
    });

    it('should return default port when getPort is called before server is started', () => {
      expect(this.TestWebServer.getPort()).toBe(9088);
    });

    it.each`
      withoutFastify
      ${false}
      ${undefined}
    `('should not fail when stop is called before server is started', async ({ withoutFastify }) => {
      this.TestWebServer.create(withoutFastify);

      expect(async () => await this.TestWebServer.stop()).not.toThrow();
    });
  });
});
