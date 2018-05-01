module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_tokens',
      {
        id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        token: Sequelize.STRING,
        expire_date: Sequelize.DATE,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }
    );
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
