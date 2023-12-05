describe('ControllerRegistration', function () {

  beforeEach(() => {
    injector().inject((ControllerRegistration) => {
      this.ControllerRegistration = ControllerRegistration;
    });
  });

  it('should exist', () => {
    expect(this.ControllerRegistration).to.exist;
  });
});
