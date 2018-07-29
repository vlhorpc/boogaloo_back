const express = require('express');
const { ChatsUsersController } = require('../controllers');

const chatsUsersRouter = express.Router();

chatsUsersRouter.route('/')
  .put((req, res) => (new ChatsUsersController(req, res)).putAction());

module.exports = chatsUsersRouter;
