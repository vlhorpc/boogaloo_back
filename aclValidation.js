const url = require('url');
const models = require('./models');
const acl = require('./config/acl');
const ErrorController = require('./controllers/ErrorController');

const aclValidation = (req, res, next) => {
  const parsedUrl = url.parse(req.originalUrl, true);
  const currentResource = (parsedUrl.pathname).substr(1);
  const urlParams = parsedUrl.query;
  const error = new ErrorController();

  const { token } = urlParams;

  if (token) {
    models.UsersTokens.findOne({
      where: { token },
      include: [{ model: models.Users, as: 'user' }]
    }).then((userToken) => {
      if (userToken) {
        const { user } = userToken;
        if (user) {
          const { group_id } = user;
          const currentGroupAcl = acl.find((item) => item.type === group_id);
          const currentResourceAllow = currentGroupAcl.allows
            .find((item) => item.resource === currentResource);

          if (currentResourceAllow) {
            const methodsList = currentResourceAllow.methods;
            if (methodsList.includes('*') || methodsList.includes(req.method)) {
              return next();
            }
            return error.return403Forbidden(res);
          }
          return error.return403Forbidden(res);
        }
        return error.returnUnauthorized(res);
      }
      return error.returnUnauthorized(res);
    });
  } else {
    return error.returnUnauthorized(res);
  }
};

module.exports = aclValidation;
