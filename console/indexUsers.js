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

models.Users.findAll().then((users) => {
  const promises = [];

  users.map((user) => {
    promises.push(client.index({
      index: 'boogaloo_users',
      type: 'users',
      body: user
    }));
  });

  return Promise.all(promises).then(() => {
    console.log('Closing connection to DB');
    models.sequelize.close();
  });
}).then(() => {
  console.log('Closing connection to ElasticSearch');
  client.close();
});

