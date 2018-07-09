const dishRouter = require('./dishRouter');
const promoRouter = require('./promoRouter');
const indexRouter = require('./indexRouter');
const usersRouter = require('./usersRouter');
const signRouter = require('./signRouter');
const usersFriendsRouter = require('./usersFriendsRouter');
const searchRouter = require('./searchRouter');

const aclMiddleware = require('../middlewares/aclMiddleware');
const urlParamsMiddleware = require('../middlewares/urlParamsMiddleware');
const urlConditionsMiddleware = require('../middlewares/urlConditionsMiddleware');

const routesList = (app, io, participants) => {
  app.use((req, res, next) => {
    req.socketsData = {
      io,
      participants
    };
    next();
  });

  app.use(aclMiddleware);
  app.use(urlParamsMiddleware);
  app.use(urlConditionsMiddleware);
  app.use('/sign', signRouter);
  app.use('/users', usersRouter);
  app.use('/dishes', dishRouter);
  app.use('/promotions', promoRouter);
  app.use('/users_friends', usersFriendsRouter);
  app.use('/search', searchRouter);
  app.use('/', indexRouter);


  // 404 catch
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
};

module.exports = routesList;
