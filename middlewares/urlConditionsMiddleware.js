const url = require('url');

const createOperation = (operationString, operationsArray) => {
  // console.log('operationString', operationString);
  const parts = operationString.split('=');
  // console.log('parts', parts);
  operationsArray[parts[0]] = {
    ['gt']: parts[1]
  };
  return operationsArray;
};


const createWhereObject = (whereString, whereObject, fullObject) => {
  const wherePattern = /^[[|(](\[|\(\S+\)),(\[|\(\S+\))[\]|\)]$/g;
  const matches = wherePattern.exec(whereString);

  if (matches && matches.length) {
    const operatorType = [whereString[0] === '[' ? 'or' : 'and'];
    whereObject[operatorType] = {};

    whereObject[whereString[0] === '[' ? 'or' : 'and'] = [
      createWhereObject(matches[1], whereObject[operatorType], fullObject),
      createWhereObject(matches[2], whereObject[operatorType], fullObject)
    ];
    return whereObject;
  } else {
    let operationsObject = {};
    const stringParts = whereString.slice(1, -1).split(',');
    stringParts.forEach(part => operationsObject = createOperation(part, operationsObject));
    return operationsObject;
  }
};

const urlConditionsMiddleware = (req, res, next) => {
  const urlParts = url.parse(req.url, true);
  const urlParams = urlParts.query;
  let where = {};
  // REGULAR ===> (some values)(some sign)(another value)


  createWhereObject(urlParams.where, where, where);

  res.json(where);

  // next();
};

module.exports = urlConditionsMiddleware;
