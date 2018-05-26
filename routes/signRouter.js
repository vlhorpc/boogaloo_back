const express = require('express');
const { SignController } = require('../controllers');

const signRouter = express.Router();

signRouter.route('/')
  .get((req, res) => (new SignController(req, res)).getAction())
  .post((req, res) => (new SignController(req, res)).postAction())
  .delete((req, res) => (new SignController(req, res)).deleteAction());

module.exports = signRouter;
