const express = require('express');
const bodyParser = require('body-parser');
const { UsersFriendsController } = require('../controllers');

const usersFriendsRouter = express.Router();

usersFriendsRouter.use(bodyParser.json());

usersFriendsRouter.route('/')
  .get((req, res) => (new UsersFriendsController(req, res)).getAction());


module.exports = usersFriendsRouter;
