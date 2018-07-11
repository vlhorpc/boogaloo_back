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
  };

  return Chats;
};
