module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'users_tokens',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: Sequelize.INTEGER,
        token: Sequelize.STRING,
        expire_date: Sequelize.DATE,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        charset: 'utf8_general_ci'
      }
    );
    queryInterface.addConstraint('users_tokens', ['user_id'], {
      type: 'foreign key',
      name: 'users_tokens',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    return queryInterface;
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
