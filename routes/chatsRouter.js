const express = require('express');
const { ChatsController } = require('../controllers');

const chatsRouter = express.Router();

chatsRouter.route('/')
  .get((req, res) => (new ChatsController(req, res)).getAction())
  .put((req, res) => (new ChatsController(req, res)).putAction())
  .post((req, res) => (new ChatsController(req, res)).postAction())
  .delete((req, res) => (new ChatsController(req, res)).deleteAction());

module.exports = chatsRouter;
