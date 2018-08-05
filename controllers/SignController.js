const models = require('../models');
const crypto = require('crypto');
const url = require('url');
const moment = require('moment');
const Controller = require('./Controller');
const UsersController = require('./UsersController');

class SignController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  getAction() {
    const { token, userId } = this.req.urlParams;

    if (token && userId) {
      this.checkToken(this.req, this.res);
    } else {
      this.loginUser(this.req, this.res);
    }
  }

  postAction() {
    this.registerUser();
  }

  deleteAction() {
    this.logoutUser();
  }

  registerUser() {
    const { req } = this;
    const bodyParams = req.body;
    const { login, password } = bodyParams;

    if (login && password) {
      const hashedPassword = crypto.createHmac('sha256', password)
        .digest('hex');

      models.Users.findOne({
        where: { login, password: hashedPassword }
      }).then((user) => {
        if (user) {
          this.setResponseData({ code: 403, message: 'USER ALREADY EXISTS' });
          this.returnInformation();
        }
        bodyParams.password = hashedPassword;
        models.Users.create(bodyParams).then((createdUser) => {
          const usersController = new UsersController();
          usersController.indexUserByUserId(createdUser.id);

          this.response = createdUser;
          this.returnInformation();
        });
      });
    } else {
      this.setResponseData({ code: 422, response: bodyParams });
      this.returnInformation();
    }
  }

  loginUser(req) {
    const urlParts = url.parse(req.url, true);
    const params = urlParts.query;
    const { login, password } = params;

    if (login && password) {
      const hashedPassword = crypto.createHmac('sha256', password)
        .digest('hex');

      models.Users.findOne({
        where: { login, password: hashedPassword }
      }).then((user) => {
        if (user) {
          models.UsersTokens.findOne({
            where: { user_id: user.id }
          }).then((userToken) => {
            if (userToken) {
              userToken.token = this.generateToken(login, password);
              userToken.expire_date = this.returnExpireDate();
              userToken.save().then(savedToken => {
                this.response = { user, token: savedToken };
                this.returnInformation();
              });
            } else {
              const newwUserToken = {
                user_id: user.id,
                token: this.generateToken(login, password),
                expire_date: this.returnExpireDate()
              };
              models.UsersTokens.create(newwUserToken).then(token => {
                this.response = { user, token };
                this.returnInformation();
              });
            }
          });
        } else {
          this.code = 404;
          this.message = 'USER DOESN\'T EXIST';
          this.returnInformation();
        }
      });
    } else {
      this.code = 422;
      this.response = params;
      this.returnInformation();
    }
  }

  checkToken() {
    const { token, userId } = this.req.urlParams;

    models.UsersTokens.findOne({
      where: { token, user_id: userId }
    }).then((userToken) => {
      if (userToken) {
        this.response = { userToken };
        this.returnInformation();
      }
      this.setResponseData({ code: 403, response: this.req.urlParams });
      this.returnInformation();
    });
  }

  logoutUser(req, res) {
    const urlParts = url.parse(req.url, true);
    const params = urlParts.query;
    const { token, userId } = params;

    if (token && userId) {
      models.UsersTokens.destroy({
        where: { token, user_id: userId }
      }).then((deletedToken) => {
        if (deletedToken) {
          this.response = { deletedToken, deleted: true };
          this.returnInformation();
        }
        this.code = 404;
        this.response = { token, userId, deleted: false };
        this.returnInformation();
      });
    } else {
      this.code = 422;
      this.response = params;
      this.returnInformation();
    }
  }

  generateToken(login, password) {
    return crypto.createHmac('sha256', login + password + (new Date()))
      .digest('hex');
  }

  returnExpireDate() {
    const currentDate = moment();
    return moment(currentDate).add(3, 'days');
  }
}

module.exports = SignController;
