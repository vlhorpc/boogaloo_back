'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'chats',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        admin_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        chat_type: Sequelize.STRING,
        last_message: Sequelize.TEXT,
        last_message_id: Sequelize.INTEGER,
        last_message_time: Sequelize.DATE,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      }
    );
    queryInterface.addConstraint('chats', ['admin_id'], {
      type: 'foreign key',
      name: 'chat_owner',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    queryInterface.addConstraint('chats', ['last_message_id'], {
      type: 'foreign key',
      name: 'current_chat_last_message',
      references: {
        table: 'chats_messages',
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
