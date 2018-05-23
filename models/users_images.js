module.exports = (sequelize, DataTypes) => {
  const UsersImages = sequelize.define('UsersImages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    size: DataTypes.STRING,
    width: DataTypes.STRING,
    height: DataTypes.STRING,
    image_type: DataTypes.STRING,
    href: DataTypes.STRING,
    absolute_href: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'users_images'
  });

  UsersImages.associate = (models) => {
    models.UsersImages.belongsTo(models.Users, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'user'
    });
  };

  return UsersImages;
};
