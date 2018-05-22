const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');

const usersRouter = express.Router();

const { UsersController } = require('../controllers');

usersRouter.use(bodyParser.json());

usersRouter.route('/')
  .get((req, res) => (new UsersController(req, res)).getAction())
  .post((req, res, next) => {
    // @TODO
  })
  .put((req, res) => {
    // @TODO
  })
  .delete((req, res, next) => {
    // @TODO
  });


module.exports = usersRouter;
