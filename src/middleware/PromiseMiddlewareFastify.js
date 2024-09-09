const FastifyResponseFormatter = require('../fastify/FastifyResponseFormatter');

module.exports = function (Promise, BaseMiddleware) {
  class PromiseMiddlewareFastify extends BaseMiddleware {
    register(app) {
      super.configure(app);

      app.decorateReply('json', function (...args) {
        this.log.warn('json() will be deprecated, use send() instead');
        return this.send(...args);
      });

      app.decorateReply('jsonAsync', function (...args) {
        this.log.warn('jsonAsync() will be deprecated, see https://fastify.dev/docs/latest/Reference/Routes/#async-await');
        return this.sendAsync(...args);
      });

      app.decorateReply('render', function (view, properties) {
        this.log.warn('render() will be deprecated, use view() instead (by default @fastify/view decorates the reply with view())');
        return this.view(view, properties);
      });

      app.decorateReply('renderAsync', function (view, properties) {
        this.log.warn('renderAsync() will be deprecated, see https://fastify.dev/docs/latest/Reference/Routes/#async-await');
        // istanbul ignore next -- fallback {} is just for safety
        return Promise.props(properties ?? {})
          .then((props) => this.render(view, props));
      });

      app.decorateReply('sendAsync', function (...args) {
        this.log.warn('sendAsync() will be deprecated, see https://fastify.dev/docs/latest/Reference/Routes/#async-await');
        return Promise.all(args)
          .then((result) => {
            return this.send.apply(this, result);
          });
      });

      app.decorateReply('sendStatusAsync', function (...args) {
        this.log.warn('sendStatusAsync() will be deprecated, see https://fastify.dev/docs/latest/Reference/Routes/#async-await');
        return Promise.all(args)
          .then(([{ status }]) => this.status(status).send('OK'));
      });

      app.decorateReply('format', function (map) {
        this.log.warn('format() will be deprecated, use send() instead with your own accept-header/format logic');

        return FastifyResponseFormatter.format(this, map);
      });

      app.decorateReply('formatAsync', function (documentKey, potentialPromise) {
        this.log.warn('formatAsync() will be deprecated, use send() instead with your own accept-header/format logic');

        return Promise.cast(potentialPromise)
          .then((results) =>
            FastifyResponseFormatter.format(this, {
              html: () => {
                this.type('text/javascript');
                this.send(`document.${documentKey} = ${JSON.stringify(results)};`);
              },
            })
          );
      });
    }
  }

  return new PromiseMiddlewareFastify();
};
