module.exports = (sequelize, DataTypes) => {
  const UsersFriends = sequelize.define('UsersFriends', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    friend_id: DataTypes.INTEGER,
    accepted: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'users_friends'
  });


  UsersFriends.associate = (models) => {
    models.UsersFriends.belongsTo(models.Users, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'user'
    });
  };

  return UsersFriends;
};
