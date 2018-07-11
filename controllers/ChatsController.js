const models = require('../models');
const crypto = require('crypto');
const url = require('url');
const moment = require('moment');
const Controller = require('./Controller');

class ChatsController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  getAction() {
    return this.res.json('getAction');
    // const { token, userId } = this.req.urlParams;

    // if (token && userId) {
    //   this.checkToken(this.req, this.res);
    // } else {
    //   this.loginUser(this.req, this.res);
    // }
  }

  postAction() {
    this.res.json('putAction');
  }

  postAction() {
    this.res.json('postAction');
  }

  deleteAction() {
    this.res.json('deleteAction');
  }
}

module.exports = ChatsController;
