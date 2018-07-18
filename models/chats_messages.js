module.exports = (sequelize, DataTypes) => {
  const ChatsMessages = sequelize.define('ChatsMessages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chat_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'chats_messages'
  });

  ChatsMessages.associate = (models) => {
    models.ChatsMessages.belongsTo(models.Chats, {
      foreignKey: 'chat_id',
      sourceKey: 'id',
      as: 'messages'
    });
  };

  return ChatsMessages;
};
