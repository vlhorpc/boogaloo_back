const express = require('express');
const { ChatsMessagesController } = require('../controllers');

const chatsMessagesRouter = express.Router();

chatsMessagesRouter.route('/')
  .get((req, res) => (new ChatsMessagesController(req, res)).getAction())
  .post((req, res) => (new ChatsMessagesController(req, res)).postAction())
  .put((req, res) => (new ChatsMessagesController(req, res)).putAction())
  .delete((req, res) => (new ChatsMessagesController(req, res)).deleteAction());

module.exports = chatsMessagesRouter;
