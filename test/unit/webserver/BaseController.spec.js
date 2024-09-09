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

  it.each([['express', false], ['fastify', true]])('should call controller method with request object containing express-device value when using underlying %s server', async (_, withFastify) => {
    // Arrange
    let mockRouteHandler, httpService, testWebServer;

    injector().inject((Logger, MockController, HTTPService, TestWebServer) => {
      Logger.useNoop();

      httpService = HTTPService;
      testWebServer = TestWebServer;
      mockRouteHandler = jest.spyOn(MockController, 'handleIndexRoute');
      expect(true).toBeTruthy();
    });

    const webServer = await testWebServer.start({ withFastify });

    // Act
    await httpService.get('http://localhost:9088/')
      .set('user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) Amar/8612 (KHTML, like Gecko) Mobile/19A344 FBDV/iPhone14,2 Sri')
      .promise();

    await webServer.stop();

    // Assert
    expect(mockRouteHandler).toHaveBeenCalledTimes(1);

    const [requestArg, responseArg] = mockRouteHandler.mock.calls[0];
    expect(requestArg).toEqual(
      expect.objectContaining({
        device: expect.objectContaining({ type: 'phone', name: 'iPhone' }),
      })
    );
    expect(responseArg).toEqual(expect.any(Object));
  });
});
