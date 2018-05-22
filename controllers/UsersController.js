const models = require('../models');
const Controller = require('./Controller');

class UsersController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  getAction() {
    const { limit, offset } = this.req.urlParams;

    models.Users.findAndCountAll({
      include: [models.Tasks, models.UsersFriends],
      offset: Number(offset) || 0,
      limit: Number(limit) || 10
    }).then((users) => {
      this.total = users.count;
      this.response = users.rows;
      this.returnInformation();
    });
  }
}

module.exports = UsersController;
