const models = require('../models');
const Controller = require('./Controller');

class SearchController extends Controller {
  constructor(req, res, client) {
    super();
    this.req = req;
    this.res = res;
    this.client = client;
  }

  getAction() {
    const { index, query } = this.req.urlParams;

    this.client.search({
      index: index || 'boogaloo_users',
      type: 'users',
      body: {
        query: {
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
      }
    }).then((response) => {
      this.response = response.hits;
      this.returnInformation();
    });
  }
}

module.exports = SearchController;
