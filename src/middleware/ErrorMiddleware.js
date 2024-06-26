module.exports = function (SpurErrors, Logger, HtmlErrorRender, BaseMiddleware) {
  class ErrorMiddleware extends BaseMiddleware {
    configure(app) {
      super.configure(app);

      this.EXCLUDE_STATUSCODE_FROM_LOGS = [404];
      this.app.use(this.throwNotFoundError);
      this.app.use(this.middleware.bind(this));
    }

    throwNotFoundError(req, res, next) {
      next(SpurErrors.NotFoundError.create('Not Found'));
    }

    middleware(err, req, res, next) {
      if (!err.statusCode) {
        err = SpurErrors.InternalServerError.create(err.message, err);
      }

      this.appendRequestData(err, req);
      this.logErrorStack(err);

      res.status(err.statusCode);

      res.format({
        text: () => this.sendTextResponse(err, req, res),
        html: () => this.sendHtmlResponse(err, req, res),
        json: () => this.sendJsonResponse(err, req, res),
      });

      next();
    }

    logErrorStack(error) {
      const err = error ?? {};
      const statusCode = err.statusCode || 0;
      const checkStatus = (status) => status === statusCode;

      if (!(this.EXCLUDE_STATUSCODE_FROM_LOGS ?? []).some(checkStatus)) {
        Logger.error(err, '\n', err?.stack ?? '', '\n', err?.data ?? '');
      }
    }

    appendRequestData(err, req) {
      err.data = Object.assign(
        { ...err.data },
        {
          url: req.url,
        },
      );
    }

    sendTextResponse(err, req, res) {
      res.send(err.message);
    }

    sendHtmlResponse(err, req, res) {
      HtmlErrorRender.render(err, req, res);
    }

    sendJsonResponse(err, req, res) {
      res.json({ error: err.message, data: err.data });
    }
  }

  return new ErrorMiddleware();
};
