describe('BaseController', function () {

  beforeEach(() => {
    injector().inject((BaseController) => {
      this.BaseController = BaseController;
    });
  });

  it('should map a rootWebPath from config', () => {
    expect(new this.BaseController().rootWebPath).to.equal('/user/agustin/test/');
  });
});
