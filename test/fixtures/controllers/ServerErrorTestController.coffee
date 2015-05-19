module.exports = (BaseController, SpurErrors)->

  new class ServerErrorTestController extends BaseController

    configure:(app)->
      super
      app.get "/500-error-test", @getErrorTest
      app.get "/404-error-test", @getNotFoundErrorTest

    getErrorTest:(req, res)=>
      throw SpurErrors.InternalServerError.create("Some dumb server error")

    getNotFoundErrorTest:()=>
      throw SpurErrors.NotFoundError.create("Some dumb not found error")
