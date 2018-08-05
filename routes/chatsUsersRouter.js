const express = require('express');
const { ChatsUsersController } = require('../controllers');

const chatsUsersRouter = express.Router();

chatsUsersRouter.route('/')
  .get((req, res) => (new ChatsUsersController(req, res)).getAction())
  .put((req, res) => (new ChatsUsersController(req, res)).putAction());

module.exports = chatsUsersRouter;
