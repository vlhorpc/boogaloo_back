const Response = require('../libs/Response');

class Controller {
  constructor() {
    this.req = null;
    this.res = null;
    this.code = 200;
    this.response = null;
    this.message = null;
    this.total = null;
  }

  setResponseData(params) {
    Object.keys(params).forEach((key) => {
      this[key] = params[key];
    });
  }

  returnInformation() {
    const { req, res, code, response, message, total } = this;
    const { limit, offset } = req.urlParams;

    const resposneParams = {
      req,
      res,
      code,
      response,
      message,
      limit,
      offset,
      total
    };

    const responseObject = new Response(resposneParams);
    responseObject.returnResponse();
  }
}

module.exports = Controller;
