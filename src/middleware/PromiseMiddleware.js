module.exports = function (
  Promise,
  BaseMiddleware
) {

  class PromiseMiddleware extends BaseMiddleware {

    configure(app) {
      super.configure(app);

      this.app.response.jsonAsync = function (...args) {
        return Promise.all(args)
          .then((results) => this.json.apply(this, results))
          .catch(this.req.next);
      };

      this.app.response.renderAsync = function (view, properties) {
        return Promise.props(properties ?? {})
          .then((props) => this.render(view, props))
          .catch(this.req.next);
      };

      this.app.response.sendAsync = function (...args) {
        return Promise.all(args)
          .then((results) => this.send.apply(this, results))
          .catch(this.req.next);
      };

      this.app.response.sendStatusAsync = function (...args) {
        return Promise.all(args)
          .then((results) => this.sendStatus(results[0].status))
          .catch(this.req.next);
      };

      this.app.response.formatAsync = function (documentKey, potentialPromise) {
        return Promise.cast(potentialPromise)
          .then((results) => {
            this.format({
              html: () => {
                this.type('text/javascript');
                this.send(`document.${documentKey} = ${JSON.stringify(results)};`);
              },
              json: () => {
                this.json(results);
              }
            });
          })
          .catch(this.req.next);
      };
    }
  }

  return new PromiseMiddleware();
};
