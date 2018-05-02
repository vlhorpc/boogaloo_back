const url = require('url');

const urlConditionsMiddleware = (req, res, next) => {
  const urlParts = url.parse(req.url, true);
  const urlParams = urlParts.query;

  const availableParams = ['where', 'limit', 'offset'];
  const urlConditions = {};

  availableParams.map((item) => {
    if (urlParams[item]) {
      urlConditions[item] = urlParams[item];
    }
    return true;
  });

  req.conditions = urlConditions;

  next();
};

module.exports = urlConditionsMiddleware;
