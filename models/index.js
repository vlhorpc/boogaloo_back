const config = require('../config');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(config.mysql);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected correctly to MySQL Database');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .map((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
    return true;
  });

Object.keys(db).map((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  return true;
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
