module.exports = function (BaseController) {

  class MockController extends BaseController {
    configure(app) {
      super.configure(app);
      app.get("/", this.handleIndexRoute);
      app.get("/with-error", (req, res) => { throw new Error("Throwing a basic error") });
    }

    handleIndexRoute(req, res) {
      res.status(200).send("SomeIndex");
    }
  }

  return new MockController();
}
