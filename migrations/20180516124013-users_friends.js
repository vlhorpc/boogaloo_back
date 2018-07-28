

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'users_friends',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: Sequelize.INTEGER,
        friend_id: Sequelize.INTEGER,
        accepted: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      }
    );
    queryInterface.addConstraint('users_friends', ['user_id'], {
      type: 'foreign key',
      name: 'users_friends',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    queryInterface.addConstraint('users_friends', ['friend_id'], {
      type: 'foreign key',
      name: 'users_friends_id',
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
