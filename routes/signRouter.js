const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const controllers = require('../controllers');

const signRouter = express.Router();
const { SignController } = controllers;

signRouter.use(bodyParser.json());

signRouter.route('/')
  .get((req, res) => {
    const urlParts = url.parse(req.url, true);
    const params = urlParts.query;
    const { token, userId } = params;

    const sign = new SignController(req, res);

    if (token && userId) {
      sign.checkToken(req, res);
    } else {
      sign.loginUser(req, res);
    }
  })
  .post((req, res) => {
    const sign = new SignController(req, res);
    sign.registerUser(req, res);
  })
  .delete((req, res) => {
    const sign = new SignController(req, res);
    sign.logoutUser(req, res);
  });


module.exports = signRouter;
