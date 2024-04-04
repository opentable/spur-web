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
});
