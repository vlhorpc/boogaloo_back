const express = require('express');
const bodyParser = require('body-parser');

const usersNotReadMessagesRouter = express.Router();

const { UsersNotReadMessagesController } = require('../controllers');

usersNotReadMessagesRouter.use(bodyParser.json());

usersNotReadMessagesRouter.route('/')
  .get((req, res) => (new UsersNotReadMessagesController(req, res)).getAction());


module.exports = usersNotReadMessagesRouter;
