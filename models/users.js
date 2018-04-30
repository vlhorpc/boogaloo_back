module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    name: DataTypes.STRING
  }, {
    tableName: 'users'
  });

  // User.associate = function(models) {
  //   models.User.hasMany(models.Task);
  // };

  return Users;
};
