module.exports = (sequelize, DataTypes) => {
  const Tasks = sequelize.define('Tasks', {
    title: DataTypes.STRING
  }, {
    timestamps: false,
    tableName: 'tasks'
  });

  return Tasks;
};
