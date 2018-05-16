const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');

const usersFriendsRouter = express.Router();

usersFriendsRouter.use(bodyParser.json());

usersFriendsRouter.route('/')
  .get((req, res) => {
    const { userId } = req.urlParams;

    models.UsersFriends.findAndCountAll({
      where: {
        user_id: userId
      }
    }).then((response) => {
      res.json(response);
    });
  });


module.exports = usersFriendsRouter;
