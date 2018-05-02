const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');

const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter.route('/')
  .get((req, res) => {
    models.Users.findAll({
      include: [models.Tasks],
      attributes: ['id', 'name', 'surname']
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


module.exports = userRouter;
