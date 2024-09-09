const FastifyResponseFormatter = require('../fastify/FastifyResponseFormatter');

module.exports = function (BaseMiddleware, Logger, HtmlErrorRender, SpurErrors) {
  class ErrorMiddlewareFastify extends BaseMiddleware {
    EXCLUDE_STATUSCODE_FROM_LOGS = [404];

    register(app) {
      super.configure(app);

      app.setNotFoundHandler(this.#throwNotFoundError.bind(this));
      app.setErrorHandler(this.#middleware.bind(this));
    }

    #appendRequestData(err, req) {
      err.data = Object.assign(
        { ...err.data },
        {
          url: req.url,
        },
      );
    }

    #formatError(err, req, reply) {
      reply.status(err.statusCode);

      this.#appendRequestData(err, req);
      this.logErrorStack(err);

      return FastifyResponseFormatter.format(reply, {
        text: () => this.sendTextResponse(err, req, reply),
        html: () => this.sendHtmlResponse(err, req, reply),
        json: () => this.sendJsonResponse(err, req, reply),
      });
    }

    #throwNotFoundError(req, reply) {
      return this.#formatError(SpurErrors.NotFoundError.create('Not Found'), req, reply);
    }

    #middleware(err, req, reply) {
      const error = err.statusCode
        ? err
        : SpurErrors.InternalServerError.create(err.message, err);

      return this.#formatError(error, req, reply);
    }

    logErrorStack(error) {
      const err = error ?? {};
      const statusCode = err.statusCode || 0;
      const checkStatus = (status) => status === statusCode;

      if (!(this.EXCLUDE_STATUSCODE_FROM_LOGS ?? []).some(checkStatus)) {
        Logger.error(err, '\n', err?.stack ?? '', '\n', err?.data ?? '');
      }
    }

    sendTextResponse(err, req, reply) {
      return reply.type('text/plain').send(err.message);
    }

    sendHtmlResponse(err, req, reply) {
      reply.type('text/html');
      return HtmlErrorRender.render(err, req, reply);
    }

    sendJsonResponse(err, req, reply) {
      return reply.type('application/json').send({ error: err.message, data: err.data });
    }
  }

  return new ErrorMiddlewareFastify();
};
