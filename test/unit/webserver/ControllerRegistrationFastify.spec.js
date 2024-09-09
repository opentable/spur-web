describe('ControllerRegistrationFastify', function () {

  beforeEach(() => {
    injector().inject((ControllerRegistrationFastify, Logger) => {
      this.ControllerRegistrationFastify = ControllerRegistrationFastify;

      Logger.useRecorder();
    });
  });

  it('should exist', () => {
    expect(this.ControllerRegistrationFastify).toBeDefined();
  });

  it('should return router for fastify', () => {
    // Arrange
    const fastifyMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      options: jest.fn(),
      head: jest.fn(),
      trace: jest.fn(),
      register: jest.fn(),
    };

    // Act
    this.ControllerRegistrationFastify.register(fastifyMock);

    // Assert
    expect(fastifyMock.get).toHaveBeenCalledTimes(13);
  });
});
