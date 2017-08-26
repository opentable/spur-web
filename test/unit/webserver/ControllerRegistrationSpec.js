describe('ControllerRegistration', function () {
  const base = this;

  beforeEach(() => {
    injector().inject(function (ControllerRegistration) {
      base.ControllerRegistration = ControllerRegistration;
    });
  });

  it('should exist', () => {
    expect(base.ControllerRegistration).to.exist;
  });
});
