const models = require('../models');
const op = models.Sequelize.Op;
const operatorsAliases = {
  $eq: op.eq,
  $or: op.or
};

const Controller = require('./Controller');

class UsersController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  getAction() {
    const { limit, offset, relations, where } = this.req.urlParams;
    console.log('where', where);
    models.Users.findAndCountAll({
      include: relations,
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      where
    }).then((users) => {
      console.log('users', users);
      this.total = users.count;
      this.response = users.rows;
      this.code = users.count > 0 ? this.code : 404;
      this.returnInformation();
    });
  }
}

module.exports = UsersController;
