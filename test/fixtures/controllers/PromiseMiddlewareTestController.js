module.exports = function (BaseController, Promise) {

  class PromiseMiddlewareTestController extends BaseController {

    configure(app) {
      super.configure(app);

      app.set('view engine', 'ejs');
      app.set('views', `${__dirname}/views`);

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
      const { headers } = req;
      const view = headers['x-view'];
      const viewPropsHeader = headers['x-view-props'];
      const viewProps = viewPropsHeader !== 'undefined' ? JSON.parse(viewPropsHeader) : undefined;
      if (viewProps) {
        res.renderAsync(view, Promise.resolve(viewProps));
      } else {
        res.renderAsync(view);
      }
    }

    getSendAsync(req, res) {
      res.sendAsync(Promise.resolve('sendAsync success'));
    }

    getSendStatusAsync(req, res) {
      res.sendStatusAsync(Promise.resolve({ status: 200 }));
    }

    getFormatAsync(req, res) {
      res.formatAsync('innerHTML', Promise.resolve('formatAsync success'));
    }
  }

  return new PromiseMiddlewareTestController();
};
