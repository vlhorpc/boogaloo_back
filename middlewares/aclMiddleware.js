const url = require('url');
const models = require('../models');
const acl = require('../config/acl');
const Response = require('../libs/Response');

const aclMiddleware = (req, res, next) => {
  const parsedUrl = url.parse(req.originalUrl, true);
  const currentResource = (parsedUrl.pathname).substr(1);
  const urlParams = parsedUrl.query;
  const response = new Response(req, res);

  const { token } = urlParams;

  models.UsersTokens.findOne({
    where: { token },
    include: [{ model: models.Users, as: 'user' }]
  }).then((userToken) => {
    let group_id = 3; // guest group

    if (userToken) {
      const { user } = userToken;
      if (user) {
        group_id = user.group_id;
      }
    }

    const currentGroupAcl = acl.find(item => item.type === group_id);
    const currentResourceAllow = currentGroupAcl.allows
      .find(item => item.resource === currentResource);

    if (currentResourceAllow) {
      const methodsList = currentResourceAllow.methods;
      if (methodsList.includes('*') || methodsList.includes(req.method)) {
        req.userData = userToken;
        return next();
      }
    }

    response.setResponseData({ code: 403 });
    return response.returnResponse();
  });
};

module.exports = aclMiddleware;
