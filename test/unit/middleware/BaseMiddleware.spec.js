describe('BaseMiddleware', function () {
  beforeEach(() => {
    return injector().inject((TestBaseMiddleware, Logger) => {
      this.TestBaseMiddleware = TestBaseMiddleware;
      this.Logger = Logger;

      this.Logger.useRecorder();
    });
  });

  it('should log subclass registration', () => {
    this.TestBaseMiddleware.configure('app');

    expect(this.Logger.recorded.log).toStrictEqual([['Subclass called']]);

    expect(this.Logger.recorded.info).toStrictEqual([['Registering Middleware: TestBaseMiddleware']]);
  });
});
