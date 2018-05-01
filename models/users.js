module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    group_id: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    status: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
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
