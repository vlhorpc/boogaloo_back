const models = require('../models');
const elasticsearch = require('elasticsearch');

const Controller = require('./Controller');

class UsersController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  getAction() {
    const { limit, offset, relations, where, order } = this.req.urlParams;

    models.Users.findAndCountAll({
      include: relations,
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      where,
      order: order && order.orderData
        ? order.orderFunction(order.orderData, 'Users', models.sequelize) : null
    }).then((users) => {
      this.total = users.count;
      this.response = users.rows;
      this.code = users.count > 0 ? this.code : 404;
      this.returnInformation();
    });
  }

  indexUserByUserId(userId) {
    const client = new elasticsearch.Client({
      host: 'localhost:9200'
    });

    client.ping({
      requestTimeout: 30000
    }, (error) => {
      if (error) {
        console.error('ElasticSearch cluster is down!');
      } else {
        console.log('Connected correctly to ElasticSearch Cluster.');
      }
    });

    models.Users.find({
      where: {
        id: userId
      }
    }).then((user) => {
      const promises = [];
      const resultUser = user.dataValues;

      resultUser.ngram_name = user.name;
      resultUser.absolute_name = user.name;

      resultUser.ngram_surname = user.surname;
      resultUser.absolute_surname = user.surname;

      resultUser.ngram_login = user.login;
      resultUser.absolute_login = user.login;

      promises.push(client.index({
        index: 'boogaloo_users',
        type: 'users',
        id: resultUser.id,
        body: resultUser
      }).catch((err) => console.log('err', err)));

      return Promise.all(promises).then(() => {
        client.close();
      });
    });
  }
}

module.exports = UsersController;
