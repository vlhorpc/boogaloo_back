const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
  .get((req, res, next) => {
    Dishes.find({})
      .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    console.log('req.body', req.body);
    Dishes.create(req.body)
      .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
  })
  .delete((req, res, next) => {
    Dishes.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, err => next(err))
      .catch(err => next(err));
  });

dishRouter.route('/:dishId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: req.body
    }, { new: true })
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, err => next(err))
      .catch(err => next(err));
  });

dishRouter.route('/:dishId/comments')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments);
        } else {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        }
        return true;
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          dish.comments.push(req.body);
          dish.save()
            .then((savedDish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(savedDish);
            }, err => next(err));
        } else {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        }
        return true;
      }, err => next(err))
      .catch(err => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /dishes/${
      req.params.dishId}/comments`);
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          for (let i = (dish.comments.length - 1); i >= 0; i -= 1) {
            dish.comments.id(dish.comments[i]._id).remove();
          }
          dish.save()
            .then((savedDish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(savedDish);
            }, err => next(err));
        } else {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        }
        return true;
      }, err => next(err))
      .catch(err => next(err));
  });

dishRouter.route('/:dishId/comments/:commentId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments.id(req.params.commentId));
        } else if (dish == null) {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
        return true;
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/${req.params.dishId
    }/comments/${req.params.commentId}`);
  })
  .put((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          console.log('req.body', req.body);
          const newDish = dish;
          // console.log('req.param', req.params);
          // console.log('req.body.rating', req.body.rating);
          if (req.body.rating) {
            newDish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.comment) {
            newDish.comments.id(req.params.commentId).comment = req.body.comment;
          }
          newDish.save()
            .then((savedDish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(savedDish);
            }, err => next(err));
        } else if (dish == null) {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
        return true;
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          dish.comments.id(req.params.commentId).remove();
          dish.save()
            .then((savedDish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(savedDish);
            }, err => next(err));
        } else if (dish == null) {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
        return true;
      }, err => next(err))
      .catch(err => next(err));
  });

module.exports = dishRouter;
