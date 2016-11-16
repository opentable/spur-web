module.exports = function (BaseController) {
  class HelloController extends BaseController {

    configure(app) {
      super.configure(app);

      app.get('/', this.getRoot.bind(this));
      app.get('/hello', this.getHello.bind(this));
    }

    getRoot(req, res) {
      res.status(200).send('This is the root page defined in HelloController.js.');
    }

    getHello(req, res) {
      const model = {
        user: req.query.user || 'John Doe'
      };

      res.render('hello', model);
    }

  }

  return new HelloController();
};
