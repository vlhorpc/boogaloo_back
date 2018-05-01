const models = require('../models');
const ErrorController = require('./ErrorController');
const ResponseController = require('./ResponseController');
const crypto = require('crypto');
const url = require('url');

const secret = 'boogaloo';

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
          const response = new ResponseController();
          const userToken = {
            user_id: user.id,
            token: this.generateToken(login, password)
          };
          models.UsersTokens.create(userToken).then((token) => {
            return response.returnSuccessResponse(res, { user, token });
          });
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

  generateToken(login, password) {
    return crypto.createHmac('sha256', login + password)
      .digest('hex');
  }
}

module.exports = SignController;
