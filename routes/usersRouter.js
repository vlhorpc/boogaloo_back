const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');

const usersRouter = express.Router();

usersRouter.use(bodyParser.json());

usersRouter.route('/')
  .get((req, res) => {
    console.log('req.urlParams', req.urlParams);
    const { limit, offset } = req.urlParams;

    models.Users.findAndCountAll({
      include: [models.Tasks, models.UsersFriends],
      offset: Number(offset) || 0,
      limit: Number(limit) || 10
    }).then((users) => {
      res.json(users);
    });
  })
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
