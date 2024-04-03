module.exports = function (BaseController, SpurErrors) {
  class ServerErrorTestController extends BaseController {
    configure(app) {
      super.configure(app);
      app.get('/500-error-test', this.getErrorTest.bind(this));
      app.get('/500-standard-error-test', this.getStandardErrorTest.bind(this));
      app.get('/404-error-test', this.getNotFoundErrorTest.bind(this));
    }

    getErrorTest(req, res) {
      throw SpurErrors.InternalServerError.create('Some dumb server error');
    }

    getStandardErrorTest(req, res) {
      throw 'Some dumb server error';
    }

    getNotFoundErrorTest() {
      throw SpurErrors.NotFoundError.create('Some dumb not found error');
    }
  }

  return new ServerErrorTestController();
};
