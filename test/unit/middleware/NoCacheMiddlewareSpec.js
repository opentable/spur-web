describe('NoCacheMiddleware', function () {
  const base = this;

  beforeEach(() => {
    injector().inject(function (NoCacheMiddleware) {
      base.NoCacheMiddleware = NoCacheMiddleware;
    });
  });

  it('should exist', () => {
    expect(base.NoCacheMiddleware).to.exist;
  });
});
