class Response {
  constructor(params) {
    const { req, res, code, response, message, total = 0, limit = 0, offset = 0 } = params;
    this.req = req;
    this.res = res;
    this.code = code;
    this.response = response;
    this.message = message;
    this.total = total;
    this.limit = Number(limit);
    this.offset = Number(offset);
  }

  setResponseData(params) {
    Object.keys(params).forEach((key) => {
      this[key] = params[key];
    });
  }

  returnResponse() {
    const { res, code, response, message, total, limit, offset } = this;
    const responseObject = {
      meta: {
        code,
        message: message || this.returnResponseMessage(),
        total,
        limit,
        offset
      },
      data: response
    };

    res.statusCode = code;
    res.setHeader('Content-type', 'application/json');
    res.json(responseObject);
    res.end();
  }

  returnResponseMessage() {
    switch (Number(this.code)) {
      case 422:
        return 'WRONG PARAMETRS';
      case 404:
        return 'RECORDS NOT FOUND';
      case 403:
        return 'ACCESS DENIED';
      case 401:
        return 'UNAUTHORIZED';
      case 200:
        return 'SUCCESS';
      default:
        return '';
    }
  }
}

module.exports = Response;
