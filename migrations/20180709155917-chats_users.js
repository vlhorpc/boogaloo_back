'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'chats_users',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        chat_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        last_read_message_id: Sequelize.INTEGER,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      }
    );
    queryInterface.addConstraint('chats_users', ['chat_id'], {
      type: 'foreign key',
      name: 'chat_id',
      references: {
        table: 'chats',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    queryInterface.addConstraint('chats_users', ['user_id'], {
      type: 'foreign key',
      name: 'user_in_chat',
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
