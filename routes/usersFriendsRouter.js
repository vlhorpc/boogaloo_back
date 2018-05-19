const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');

const usersFriendsRouter = express.Router();

const controllers = require('../controllers');

const { UsersFriendsController } = controllers;

usersFriendsRouter.use(bodyParser.json());

usersFriendsRouter.route('/')
  .get((req, res) => (new UsersFriendsController(req, res)).getAction());


module.exports = usersFriendsRouter;
