const authValidation = (req, res, next) => {
  if (req.someToken) {
    next();
  } else {
    res.statusCode = 403;
    res.end('not authed');
  }
};

module.exports = authValidation;
