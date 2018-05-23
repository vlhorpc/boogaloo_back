const url = require('url');

const returnRelationsList = (relations) => {
  if (relations) {
    const resultRelationsList = [];
    relations.split(',')
      .forEach(relation => resultRelationsList.push(relation));
    return resultRelationsList;
  }
  return [];
};

const urlParamsMiddleware = (req, res, next) => {
  const urlParts = url.parse(req.url, true);
  req.urlParams = urlParts.query;
  req.urlParams.relations = returnRelationsList(req.urlParams.relations);

  next();
};

module.exports = urlParamsMiddleware;
