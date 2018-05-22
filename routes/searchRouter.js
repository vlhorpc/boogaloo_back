const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');
const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200'
});

client.ping({
  requestTimeout: 30000,
}, (error) => {
  if (error) {
    console.error('ElasticSearch cluster is down!');
  } else {
    console.log('Connected correctly to ElasticSearch Cluster.');
  }
});

const controllers = require('../controllers');
const { SearchController } = controllers;

const searchRouter = express.Router();

searchRouter.use(bodyParser.json());

searchRouter.route('/')
  .get((req, res) => (new SearchController(req, res, client)).getAction());

module.exports = searchRouter;
