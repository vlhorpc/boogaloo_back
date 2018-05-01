const models = require('../models');
const ErrorController = require('./ErrorController');
const ResponseController = require('./ResponseController');
const crypto = require('crypto');

const secret = 'boogaloo';

class SignController {
  constructor() {}

  registerUser(req, res) {
    const bodyParams = req.body;
    const { login, password } = bodyParams;
    if (login && password) {
      const hashedPassword = crypto.createHmac('sha256', password)
        .digest('hex');

      models.Users.findOne({
        where: { login: login, password: hashedPassword }
      }).then((user) => {
        if (user) {
          const error = new ErrorController();
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
            const reponse = new ResponseController();
            return reponse.returnSuccessResponse(res, createdUser);
          });
        }
      });
      // res.json(bodyParams);
    }
    // console.log();
    // console.log('register');
    // res.end('<h1>OK</h1>');
  }
}

module.exports = SignController;
