module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users',
      {
        id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        surname: Sequelize.STRING,
        email: Sequelize.STRING,
        login: Sequelize.STRING,
        password: Sequelize.STRING,
        group_id: Sequelize.INTEGER,
        status: Sequelize.INTEGER,
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
