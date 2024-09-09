const fs = require('fs');

module.exports = function (BaseController, Promise) {
  class PromiseMiddlewareTestController extends BaseController {
    static #compileMarkup = (markup) => (data) => {
      let compiled = markup;
      Object.entries(data).forEach(([placeholder, value]) => {
        compiled = compiled.replace(`{{${placeholder}}}`, value);
      });
      return compiled;
    };

    configure(app) {
      super.configure(app);

      const mockOpenTableTemplateViewEngine = app.isFastify
        ? {
          compile: (markup) => PromiseMiddlewareTestController.#compileMarkup(markup)
        }
        : (filePath, options, callback) => {
          fs.readFile(filePath, (err, content) => {
            const { settings, _locals, cache, ...data } = options;
            const rendered = PromiseMiddlewareTestController.#compileMarkup(content.toString())(data);
            return callback(null, rendered);
          });
        }

      app.engine('ott', mockOpenTableTemplateViewEngine);
      app.set('views', `${__dirname}/views`);

      app.get('/promise-middleware-test--json', this.getJson);
      app.get('/promise-middleware-test--jsonasync', this.getJsonAsync);
      app.get('/promise-middleware-test--render', this.getRender);
      app.get('/promise-middleware-test--renderasync', this.getRenderAsync);
      app.get('/promise-middleware-test--sendAsync', this.getSendAsync);
      app.get('/promise-middleware-test--sendStatusAsync', this.getSendStatusAsync);
      app.get('/promise-middleware-test--formatAsync', this.getFormatAsync);
      app.get('/promise-middleware-test--format', this.getFormat);
    }

    getJson(req, res) {
      res.json({ message: 'json success' });
    }

    getJsonAsync(req, res) {
      res.jsonAsync(Promise.resolve({ message: 'jsonAsync success' }));
    }

    getRender(req, res) {
      const { headers } = req;
      const view = headers['x-view'];
      const viewPropsHeader = headers['x-view-props'];
      const viewProps = viewPropsHeader !== 'undefined' ? JSON.parse(viewPropsHeader) : undefined;
      res.view(view, viewProps);
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

    getFormat(req, res) {
      res.format({
        html: () => {
          res.type('text/javascript');
          res.send('document.innerHTML = "format success";');
        },
        json: () => {
          res.send({ message: 'format success' });
        },
      });
    }
  }

  return new PromiseMiddlewareTestController();
};
