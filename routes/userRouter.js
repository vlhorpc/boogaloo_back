const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');

const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter.route('/')
  .get((req, res, next) => {
    models.Users.findAll({
      include: [models.Tasks]
    }).then((users) => {
      res.json(users);
    }).catch(() => {
      res.statusCode = 404;
      res.end('<h1>NO RECORD</h1>');
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
