const Response = require('./Response');

class Controller {
  constructor() {
    this.req = null;
    this.res = null;
    this.code = 200;
    this.response = null;
    this.message = null;
    this.error = null;
  }

  returnInformation() {
    const { req, res, code, response, message } = this;
    const { limit, offset } = req.urlParams;

    const resposneParams = {
      req,
      res,
      code,
      response,
      message,
      limit,
      offset
    };

    const responseObject = new Response(resposneParams);
    responseObject.returnResponse();
  }
}

module.exports = Controller;
