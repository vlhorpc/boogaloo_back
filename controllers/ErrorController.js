const models = require('../models');

class ErrorController {
  constructor() {}

  returnError(params) {
    const {
      res, errorCode, message, data, customHeader
    } = params;
    const error = {
      meta: {
        code: errorCode,
        message
      },
      data
    };
    res.statusCode = errorCode;
    res.setHeader('Content-type', 'application/json');
    res.json(error);
    res.end();
  }

  returnErrorMissedParams(res, data) {
    const error = {
      meta: {
        code: 422,
        message: 'WRONG PARAMETRS'
      },
      data
    };
    res.statusCode = 422;
    res.setHeader('Content-type', 'application/json');
    res.json(error);
    res.end();
  }

  return404Error(res, data) {
    const error = {
      meta: {
        code: 404,
        message: 'RECORDS NOT FOUND'
      },
      data
    };
    res.statusCode = 404;
    res.setHeader('Content-type', 'application/json');
    res.json(error);
    res.end();
  }

  returnUnauthorized(res) {
    const error = {
      meta: {
        code: 401,
        message: 'UNAUTHORIZED'
      }
    };
    res.statusCode = 401;
    res.setHeader('Content-type', 'application/json');
    res.json(error);
    res.end();
  }

  return403Forbidden(res) {
    const error = {
      meta: {
        code: 403,
        message: 'ACCESS DENIED'
      }
    };
    res.statusCode = 403;
    res.setHeader('Content-type', 'application/json');
    res.json(error);
    res.end();
  }
}

module.exports = ErrorController;
