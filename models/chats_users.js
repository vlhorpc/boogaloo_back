module.exports = (sequelize, DataTypes) => {
  const ChatsUsers = sequelize.define('ChatsUsers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chat_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    last_read_message_id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'chats_users'
  });

  ChatsUsers.associate = (models) => {
    models.ChatsUsers.belongsTo(models.Users, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'user'
    });
    models.ChatsUsers.belongsTo(models.Chats, {
      foreignKey: 'chat_id',
      sourceKey: 'id',
      as: 'chats'
    });
  };

  return ChatsUsers;
};
