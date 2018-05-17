const models = require('../models');

class ResponseController {
  constructor() {}

  returnResponse(params) {
    const {
      res, code, message, data
    } = params;
    const response = {
      meta: {
        code,
        message
      },
      data
    };
    res.statusCode = code;
    res.setHeader('Content-type', 'application/json');
    res.json(response);
    res.end();
  }

  returnSuccessResponse(res, data) {
    const response = {
      meta: {
        code: 200
      },
      data
    };
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(response);
    res.end();
  }
}

module.exports = ResponseController;
