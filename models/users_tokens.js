module.exports = (sequelize, DataTypes) => {
  const UsersTokens = sequelize.define('UsersTokens', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    expire_date: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'users_tokens'
  });

  UsersTokens.associate = (models) => {
    models.UsersTokens.belongsTo(models.Users, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'user'
    });
  };

  return UsersTokens;
};
