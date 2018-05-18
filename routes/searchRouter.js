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

const searchObject = (query) => {
  const obj = {
    query: {
      multi_match : {
        query : query,
        fields: ['name']
      }
    }
  };
  return obj;
};

const searchRouter = express.Router();

searchRouter.use(bodyParser.json());

searchRouter.route('/')
  .get((req, res) => {
    console.log('req.urlParams', req.urlParams);
    client.search({
      index: 'boogaloo_users',
      type: 'users',
      body: {
        query: {
          multi_match: {
            type: 'most_fields',
            query: req.urlParams.query,
            fields: ['name', 'email^2']
          }
        }
      }
    }).then((response) => {
      res.json(response);
    });
  });


module.exports = searchRouter;
