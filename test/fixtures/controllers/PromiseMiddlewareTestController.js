module.exports = function (BaseController, Promise) {

  class PromiseMiddlewareTestController extends BaseController {

    configure(app) {
      super.configure(app);
      app.get('/promise-middleware-test--jsonasync', this.getJsonAsync);
      app.get('/promise-middleware-test--renderasync', this.getRenderAsync);
      app.get('/promise-middleware-test--sendAsync', this.getSendAsync);
      app.get('/promise-middleware-test--sendStatusAsync', this.getSendStatusAsync);
      app.get('/promise-middleware-test--formatAsync', this.getFormatAsync);
    }

    getJsonAsync(req, res) {
      res.jsonAsync(Promise.resolve('jsonAsync success'));
    }

    getRenderAsync(req, res) {
      res.renderAsync('renderView', Promise.resolve({ microapp: 'renderAsync success' }));
    }

    getSendAsync(req, res) {
      res.sendAsync(Promise.resolve('sendAsync success'));
    }

    getSendStatusAsync(req, res) {
      res.sendStatusAsync(Promise.resolve({ status: 200 }));
    }

    getFormatAsync(req, res) {
      res.formatAsync(Promise.resolve('formatAsync success'));
    }
  }

  return new PromiseMiddlewareTestController();
};
