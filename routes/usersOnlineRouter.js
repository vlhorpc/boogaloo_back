const express = require('express');
const { UsersOnlineController } = require('../controllers');

const usersOnlineRouter = express.Router();

usersOnlineRouter.route('/')
  .get((req, res) => (new UsersOnlineController(req, res)).getAction())

module.exports = usersOnlineRouter;
