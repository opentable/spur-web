describe('BaseController', function () {
  const base = this;

  beforeEach(() => {
    injector().inject(function (BaseController) {
      base.BaseController = BaseController;
    });
  });

  it('should map a rootWebPath from config', () => {
    expect(new base.BaseController().rootWebPath).to.equal('/user/agustin/test/');
  });
});
