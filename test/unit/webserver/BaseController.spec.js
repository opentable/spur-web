describe('BaseController', function () {
  let loggerInfoSpy;

  afterEach(() => {
    jest.clearAllMocks();
  });

  const executeText = (rootWebPathUseNull) => {
    injector().inject((config, BaseController, Logger) => {
      if (rootWebPathUseNull) {
        config.RootWebPath = null;
      }
      this.BaseController = BaseController;

      Logger.useRecorder();

      loggerInfoSpy = jest.spyOn(Logger, 'info');
    });

    return new this.BaseController();
  };

  it.each`
    testCase                                                        | rootWebPathUseNull | expectedRootWebPath
    ${'map rootWebPath value when defined in config'}               | ${false}           | ${'/user/agustin/test/'}
    ${'set rootWebPath to empty string when not defined in config'} | ${true}            | ${''}
  `('should $testCase', ({ rootWebPathUseNull, expectedRootWebPath }) => {
    const baseController = executeText(rootWebPathUseNull);

    expect(baseController.rootWebPath).toBe(expectedRootWebPath);
  });

  it('should configure base controller', () => {
    const baseController = executeText();

    baseController.configure();

    expect(loggerInfoSpy).toHaveBeenCalledWith('Registering controller: BaseController');
  });

  it('should call controller method with request object containing express-device value', (done) => {
    let exception, mockRouteHandler, httpService, testWebServer;

    injector().inject((express, Logger, MockController, HTTPService, TestWebServer) => {
      Logger.useNoop();
      
      httpService = HTTPService;
      testWebServer = TestWebServer;
      mockRouteHandler = jest.spyOn(MockController, 'handleIndexRoute');
      
      const app = express();
      MockController.configure(app);

      TestWebServer.start();
    });

    httpService.get('http://localhost:9088/')
      .set('user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) Amar/8612 (KHTML, like Gecko) Mobile/19A344 FBDV/iPhone14,2 Sri')
      .promise()
      .then(() => {
        expect(mockRouteHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            device: expect.objectContaining({
              type: 'phone'
            })
          }),
          expect.any(Object),
          expect.any(Function)
        );
      })
      .catch((err) => {
        exception = err;
      })
      .finally(() => {
        testWebServer.stop();
        done(exception);
      });
  });
});
