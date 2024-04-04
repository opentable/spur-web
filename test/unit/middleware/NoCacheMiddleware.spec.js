describe('NoCacheMiddleware', function () {

  beforeEach(() => {
    return injector().inject((NoCacheMiddleware) => {
      this.NoCacheMiddleware = NoCacheMiddleware;
    });
  });

  it('should exist', () => {
    expect(this.NoCacheMiddleware).toBeDefined();
  });

  it('should set no-cache headers', () => {
    const response = {
      headers: { Expires: 5184000 },
      header: (name, value) => {
        response.headers[name] = value;
      },
    };

    this.NoCacheMiddleware({}, response, () => {});

    expect(response.headers).toStrictEqual({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });
  });
});
