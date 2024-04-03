describe('NoCacheMiddleware', function () {
  beforeEach(() => {
    return injector().inject((NoCacheMiddleware) => {
      this.NoCacheMiddleware = NoCacheMiddleware;
    });
  });

  it('should exist', () => {
    expect(this.NoCacheMiddleware).toBeDefined();
  });
});
