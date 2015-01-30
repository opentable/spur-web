module.exports = (SpurErrors, Logger, BaseMiddleware)->

  new class ErrorMiddleware extends BaseMiddleware

    configure:(@app)->
      super
      @app.use @middleware(@)

    middleware:(self)-> (err, req, res, next)->
      Logger.error(err)
      Logger.error(err.stack)
      Logger.error(err.data) if err.data

      unless err.statusCode
        err = SpurErrors.InternalServerError.create(err.message, err)

      res.status(err.statusCode)
      res.format
        text:()->
          res.send(err.message)
        html:()=>
          self.htmlErrorRender(res, err)
        json:()->
          res.json({error:err.message, data:err.data})

    htmlErrorRender:(res, error)=>
      res.send(error.stack)
