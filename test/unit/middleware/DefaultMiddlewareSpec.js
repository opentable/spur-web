describe('DefaultMiddleware', function () {
  const base = this;

  beforeEach(() => {
    injector().inject(function (DefaultMiddleware, Logger, express) {
      base.DefaultMiddleware = DefaultMiddleware;
      base.Logger = Logger;
      base.express = express;

      base.Logger.useRecorder();
    });
  });

  it('should define configure', () => {
    expect(base.DefaultMiddleware.configure).to.exist;
  });

  it('should set app in the instance', () => {
    const app = base.express();
    base.DefaultMiddleware.configure(app);
    expect(base.DefaultMiddleware.app).to.equal(app);
  });
});
