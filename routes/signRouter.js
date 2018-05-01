const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');
const controllers = require('../controllers');
const signRouter = express.Router();
const { SignController } = controllers;

signRouter.use(bodyParser.json());

signRouter.route('/')
  .get((req, res) => {
    const sign = new SignController();
    sign.loginUser(req, res);
  })
  .post((req, res) => {
    const sign = new SignController();
    sign.registerUser(req, res);
  })
  .put((req, res) => {
    // @TODO
  })
  .delete((req, res, next) => {
    // @TODO
  });


module.exports = signRouter;
