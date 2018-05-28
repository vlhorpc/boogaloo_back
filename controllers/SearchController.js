const models = require('../models');
const Controller = require('./Controller');

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

class SearchController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
    this.client = client;
  }

  returnSearchObject(index, query, idsList = [], limit = 10, offset = 0) {
    const searchParams = {
      index: index || 'boogaloo_users',
      type: 'users',
      body: {
        size: limit,
        from: offset,
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  type: 'best_fields',
                  query: query,
                  fields: [
                    'ngram_name',
                    'name^2',
                    'absolute_name^3',
                    'ngram_surname',
                    'surname^2',
                    'absolute_surname^3'
                  ]
                }
              }
            ]
          }
        }
      }
    };

    if (idsList && idsList.length) {
      searchParams.body.query.bool.filter = {
        terms: {
          id: idsList
        }
      };
    }

    return searchParams;
  }

  searchAction(index, query, idsList, limit, offset) {
    return this.client.search(this.returnSearchObject(index, query, idsList, limit, offset))
      .then((response) => { return response.hits;})
      .catch((err) => { return []; });
  }

  getAction() {
    const { index, query, limit, offset } = this.req.urlParams;

    this.client.search(this.returnSearchObject(index, query, null, limit, offset)).then((response) => {
      this.response = response.hits;
      this.returnInformation();
    }).catch((err) => {
      console.log('err', err);
    });
  }
}

module.exports = SearchController;
