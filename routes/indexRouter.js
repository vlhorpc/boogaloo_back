const express = require('express');
const bodyParser = require('body-parser');

const indexRouter = express.Router();

indexRouter.use(bodyParser.json());

indexRouter.route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.end('Will send all the indexes to you!');
  })
  .post((req, res) => {
    res.end(`Will add the index: ${req.body.name} with details: ${req.body.description}`);
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /indexes');
  })
  .delete((req, res) => {
    res.end('Deleting all indexes');
  });

module.exports = indexRouter;
