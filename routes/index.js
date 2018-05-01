const dishRouter = require('./dishRouter');
const promoRouter = require('./promoRouter');
const indexRouter = require('./indexRouter');
const userRouter = require('./userRouter');
const signRouter = require('./signRouter');

const authValidation = require('../authValidation');

// const notFoundRouter = require('./notFoundRouter');

const routesList = (app, sequelize) => {
  app.use('/sign', signRouter);
  app.use('/users', userRouter);
  app.use(authValidation);
  app.use('/dishes', dishRouter);
  app.use('/promotions', promoRouter);
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
