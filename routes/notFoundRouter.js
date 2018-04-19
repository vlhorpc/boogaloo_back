const express = require('express');

const notFoundRouter = express.Router();

notFoundRouter.route('/')
  .all((req,res,next) => {
    var err = new Error('Not Found');
    res.statusCode = 4041;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req,res) => {
    res.end('Will send all the dishes to you!');
  });



module.exports = notFoundRouter;
