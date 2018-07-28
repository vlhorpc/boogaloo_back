'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'chats_messages',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        chat_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        message: Sequelize.TEXT,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      }
    );
    queryInterface.addConstraint('chats_messages', ['chat_id'], {
      type: 'foreign key',
      name: 'chat_message_id',
      references: {
        table: 'chats',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    queryInterface.addConstraint('chats_messages', ['user_id'], {
      type: 'foreign key',
      name: 'message_owner',
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
