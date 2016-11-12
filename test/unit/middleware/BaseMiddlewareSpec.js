describe('BaseMiddleware', function () {
  beforeEach(() => {
    injector().inject((TestBaseMiddleware, Logger) => {
      this.TestBaseMiddleware = TestBaseMiddleware;
      this.Logger = Logger;

      this.Logger.useRecorder();
    });
  });

  it('should log subclass registration', () => {
    this.TestBaseMiddleware.configure('app');

    expect(this.Logger.recorded.log).to.deep.equal([
      ['Subclass called']
    ]);

    expect(this.Logger.recorded.info).to.deep.equal([
      ['Registering Middleware: TestBaseMiddleware']
    ]);
  });
});
