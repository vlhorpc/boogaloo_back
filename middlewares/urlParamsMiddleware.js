const url = require('url');

const urlParamsMiddleware = (req, res, next) => {
  const urlParts = url.parse(req.url, true);
  req.urlParams = urlParts.query;

  next();
};

module.exports = urlParamsMiddleware;
