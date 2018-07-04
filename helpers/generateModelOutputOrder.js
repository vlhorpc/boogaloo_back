const generateModelOutputOrder = (orderData, modelName, sequelize) => {
  const { fieldName, sortType, arrayOrder } = orderData;

  let resultData = null;

  if (sortType === 'FIELD') {
    resultData =
      [[sequelize.fn(sortType, sequelize.col(`${modelName}.${fieldName}`), arrayOrder)]];
  } else {
    resultData = [
      [fieldName, sortType]
    ];
  }

  return resultData;
};

module.exports = generateModelOutputOrder;
