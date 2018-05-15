const models = require('../models');
const ErrorController = require('./ErrorController');
const ResponseController = require('./ResponseController');
const crypto = require('crypto');
const url = require('url');
const moment = require('moment');

class SignController {
  constructor() {}

  registerUser(req, res) {
    const bodyParams = req.body;
    const { login, password } = bodyParams;
    const error = new ErrorController();

    if (login && password) {
      const hashedPassword = crypto.createHmac('sha256', password)
        .digest('hex');

      models.Users.findOne({
        where: { login: login, password: hashedPassword }
      }).then((user) => {
        if (user) {
          const customError = {
            res,
            errorCode: 403,
            message: 'USER ALREADY EXISTS',
            data: []
          };
          return error.returnError(customError);
        } else {
          bodyParams.password = hashedPassword
          models.Users.create(bodyParams).then((createdUser) => {
            const response = new ResponseController();
            return response.returnSuccessResponse(res, createdUser);
          });
        }
      });
    } else {
      return error.returnErrorMissedParams(res, bodyParams);
    }
  }

  loginUser(req, res) {
    const urlParts = url.parse(req.url, true);
    const params = urlParts.query;
    const { login, password } = params;
    const error = new ErrorController();

    if (login && password) {
      const hashedPassword = crypto.createHmac('sha256', password)
        .digest('hex');

      models.Users.findOne({
        where: { login: login, password: hashedPassword }
      }).then((user) => {
        if (user) {
          models.UsersTokens.findOne({
            where: { user_id: user.id }
          }).then((userToken) => {
            const response = new ResponseController();
            if (userToken) {
              userToken.token = this.generateToken(login, password);
              userToken.expire_date = this.returnExpireDate();
              userToken.save().then((savedToken) => {
                return response.returnSuccessResponse(res, { user, token: savedToken });
              });
            } else {
              const newwUserToken = {
                user_id: user.id,
                token: this.generateToken(login, password),
                expire_date: this.returnExpireDate()
              };
              models.UsersTokens.create(newwUserToken).then((token) => {
                return response.returnSuccessResponse(res, { user, token });
              });
            }
          })
        } else {
          const customError = {
            res,
            errorCode: 404,
            message: 'USER DOESN\'T EXIST'
          };
          return error.returnError(customError);
        }
      });
    } else {
      return error.returnErrorMissedParams(res, params);
    }
  }

  checkToken(req, res) {
    const urlParts = url.parse(req.url, true);
    const params = urlParts.query;
    const { token, userId } = params;
    const error = new ErrorController();

    models.UsersTokens.findOne({
      where: { token, user_id: userId }
    }).then((userToken) => {
      const response = new ResponseController();
      if (userToken) {
        return response.returnSuccessResponse(res, { userToken });
      } else {
        return error.return403Forbidden(res);
      }
    });
  }

  logoutUser(req, res) {
    const urlParts = url.parse(req.url, true);
    const params = urlParts.query;
    const { token, userId } = params;

    const error = new ErrorController();
    const response = new ResponseController();

    if (token && userId) {
      models.UsersTokens.destroy({
        where: { token, user_id: userId }
      }).then((deletedToken) => {
        if (deletedToken) {
          return response.returnSuccessResponse(res, deletedToken);
        } else {
          return error.return404Error(res, { token: token, userId, deleted: false });
        }
      });
    } else {
      return error.returnErrorMissedParams(res, params);
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
