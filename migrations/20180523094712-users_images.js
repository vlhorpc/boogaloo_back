'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'users_images',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        size: Sequelize.STRING,
        width: Sequelize.STRING,
        height: Sequelize.STRING,
        image_type: Sequelize.STRING,
        href: Sequelize.STRING,
        absolute_href: Sequelize.STRING,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        charset: 'utf8_general_ci'
      }
    );
    queryInterface.addConstraint('users_images', ['user_id'], {
      type: 'foreign key',
      name: 'users_images',
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
