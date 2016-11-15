describe('DefaultMiddleware', function () {
  beforeEach(() => {
    injector().inject((DefaultMiddleware, Logger, express) => {
      this.DefaultMiddleware = DefaultMiddleware;
      this.Logger = Logger;
      this.express = express;

      this.Logger.useRecorder();
    });
  });

  it('should define configure', () => {
    expect(this.DefaultMiddleware.configure).to.exist;
  });

  it('should set app in the instance', () => {
    const app = this.express();
    this.DefaultMiddleware.configure(app);
    expect(this.DefaultMiddleware.app).to.equal(app);
  });
});
