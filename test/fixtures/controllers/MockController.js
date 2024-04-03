module.exports = function (BaseController) {
  class MockController extends BaseController {
    configure(app) {
      super.configure(app);
      app.get('/', (req, res) => {
        res.status(200).send('SomeIndex');
      });
      app.get('/with-error', (req, res) => {
        throw new Error('Throwing a basic error');
      });
    }
  }

  return new MockController();
};
