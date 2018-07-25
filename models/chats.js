module.exports = (sequelize, DataTypes) => {
  const Chats = sequelize.define('Chats', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    admin_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    chat_type: DataTypes.STRING,
    last_message: DataTypes.TEXT,
    last_message_id: DataTypes.INTEGER,
    last_message_time: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'chats'
  });

  Chats.associate = (models) => {
    models.Chats.belongsTo(models.Users, {
      foreignKey: 'admin_id',
      sourceKey: 'id',
      as: 'admin'
    });
    models.Chats.hasMany(models.ChatsUsers, {
      foreignKey: 'chat_id',
      sourceKey: 'id',
      as: 'users'
    });
    models.Chats.belongsTo(models.ChatsMessages, {
      foreignKey: 'last_message_id',
      sourceKey: 'id',
      as: 'message'
    });
  };

  return Chats;
};
