const express = require('express');
const bodyParser = require('body-parser');
const { UsersFriendsController } = require('../controllers');

const usersFriendsRouter = express.Router();

usersFriendsRouter.use(bodyParser.json());

usersFriendsRouter.route('/')
  .get((req, res) => (new UsersFriendsController(req, res)).getAction())
  .post((req, res) => (new UsersFriendsController(req, res)).postAction())
  .delete((req, res) => (new UsersFriendsController(req, res)).delAction());


module.exports = usersFriendsRouter;
