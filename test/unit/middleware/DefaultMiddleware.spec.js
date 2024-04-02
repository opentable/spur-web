describe('DefaultMiddleware', function () {

  beforeEach(() => {
    return injector().inject((DefaultMiddleware, Logger, express) => {
      this.DefaultMiddleware = DefaultMiddleware;
      this.express = express;

      Logger.useRecorder();
    });
  });

  it('should define configure', () => {
    expect(this.DefaultMiddleware.configure).toBeDefined();
  });

  it('should set app in the instance', () => {
    const app = this.express();
    this.DefaultMiddleware.configure(app);
    expect(this.DefaultMiddleware.app).toEqual(app);
  });
});
