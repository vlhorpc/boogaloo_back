const url = require('url');

const sequelizeOperations = [
  { text: '=', operation: '$eq' },
  { text: '!=', operation: '$ne' },
  { text: '>', operation: '$gt' },
  { text: '>=', operation: '$gte' },
  { text: '<', operation: '$lt' },
  { text: '<=', operation: '$lte' },
  { text: 'IN', operation: '$in' },
  { text: 'NOT IN', operation: '$notIn' },
  { text: 'LIKE', operation: '$like' }
];

const arrayOperations = ['IN', 'NOT IN'];

const createOperation = (operationString, operationsArray) => {
  const parts = operationString.split('*');
  const operation = sequelizeOperations.find(oper => oper.text === parts[1]);
  operationsArray[parts[0]] = {
    [operation.operation]: arrayOperations.includes(operation.text) ? [parts[2].split(',')] : parts[2]
  };
  return operationsArray;
};


const createWhereObject = (whereString, whereObject, fullObject) => {
  const wherePattern = /^[[|(](\[|\(\S+\)),(\[|\(\S+\))[\]|\)]$/g;
  const matches = wherePattern.exec(whereString);

  if (matches && matches.length) {
    const operatorType = [whereString[0] === '[' ? '$or' : '$and'];
    whereObject[operatorType] = {};

    whereObject[whereString[0] === '[' ? '$or' : '$and'] = [
      createWhereObject(matches[1], whereObject[operatorType], fullObject),
      createWhereObject(matches[2], whereObject[operatorType], fullObject)
    ];
    return whereObject;
  } else {
    let operationsObject = {};
    const stringParts = whereString.slice(1, -1).split(';');
    stringParts.forEach(part => operationsObject = createOperation(part, operationsObject));
    return operationsObject;
  }
};

const urlConditionsMiddleware = (req, res, next) => {
  const urlParts = url.parse(req.url, true);
  const urlParams = urlParts.query;

  let where = {};

  req.urlParams.where = [];
  if (urlParams.where && urlParams.where.length) {
    req.urlParams.where = createWhereObject(urlParams.where, where, where);
  }

  next();
};

module.exports = urlConditionsMiddleware;
