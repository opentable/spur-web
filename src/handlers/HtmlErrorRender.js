module.exports = function () {
  class HtmlErrorRender {

    static render(err, req, res) {
      return new HtmlErrorRender().render(err, req, res);
    }

    render(error, request, response) {
      this.error = error;
      this.request = request;
      this.response = response;

      return this.response.send(this.error.stack);
    }
  }

  return HtmlErrorRender;
};
