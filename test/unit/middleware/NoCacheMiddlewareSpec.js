describe('NoCacheMiddleware', function () {
  beforeEach(() => {
    injector().inject((NoCacheMiddleware) => {
      this.NoCacheMiddleware = NoCacheMiddleware;
    });
  });

  it('should exist', () => {
    expect(this.NoCacheMiddleware).to.exist;
  });
});
