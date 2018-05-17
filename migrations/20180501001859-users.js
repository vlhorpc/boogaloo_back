module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'users',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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
  ),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
