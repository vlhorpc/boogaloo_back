const chalk = require('chalk');
const models = require('../models');

const closeConnection = () => models.sequelize.close();

class AddFakeFriends {
  constructor() {
    this.command = 'aff <userEmail> <friendsNumber>';
    this.description = 'Add fake friends';
  }

  run(userEmail = 'volodia2506@gmail.com', friendsNumber = 10) {
    models.Users.find({
      where: {
        email: userEmail
      }
    }).then((currentUser) => {
      return models.Users.findAll({
        limit: Number(friendsNumber)
      }).then((users) => {

        const promises = [];

        users.map(user => {
          promises.push(
            models.UsersFriends.create({
              user_id: currentUser.id,
              friend_id: user.id,
              accepted: 1
            }).then(() => {
              // console.log(chalk.green(' ✔ new friend added!'));
            })
          );
        });

        return Promise.all(promises).then(() => closeConnection());
      }).then(() => closeConnection());
    }).catch((err) => {
      console.log('err', err);
      console.log(chalk.red(`User with email ${chalk.blue(userEmail)} does not exist!`));
      closeConnection();
    });
  }
}

module.exports = AddFakeFriends;
