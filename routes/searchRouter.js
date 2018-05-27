const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');

const controllers = require('../controllers');
const { SearchController } = controllers;

const searchRouter = express.Router();

searchRouter.use(bodyParser.json());

searchRouter.route('/')
  .get((req, res) => (new SearchController(req, res)).getAction());

module.exports = searchRouter;
