describe('BaseMiddleware', function () {
  const base = this;

  beforeEach(() => {
    injector().inject(function (TestBaseMiddleware, Logger) {
      base.TestBaseMiddleware = TestBaseMiddleware;
      base.Logger = Logger;

      base.Logger.useRecorder();
    });
  });

  it('should log subclass registration', () => {
    base.TestBaseMiddleware.configure('app');

    expect(base.Logger.recorded.log).to.deep.equal([
      ['Subclass called']
    ]);

    expect(base.Logger.recorded.info).to.deep.equal([
      ['Registering Middleware: TestBaseMiddleware']
    ]);
  });
});
