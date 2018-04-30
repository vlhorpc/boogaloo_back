module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    name: DataTypes.STRING
  }, {
    tableName: 'users'
  });

  Users.associate = (models) => {
    console.log('models', models);
    models.Users.hasMany(models.Tasks,
      {
        foreignKey: 'user_id',
        sourceKey: 'id'
      }
    );
  };

  return Users;
};
