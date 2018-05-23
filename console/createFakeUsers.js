const faker = require('faker');
const chalk = require('chalk');
const crypto = require('crypto');

const models = require('../models');

const createUserAvatarImage = (faker, userId) => {
  const avatarData = {};
  avatarData.absolute_href = faker.image.avatar();
  avatarData.user_id = userId;
  avatarData.image_type = 'avatar';

  return models.UsersImages.create(avatarData);
};

const createNewUser = (faker) => {
  const newUserData = faker.helpers.userCard();
  const userName = newUserData.name;
  newUserData.name = (userName).substr(0, userName.indexOf(' '));
  newUserData.surname = (userName).substr(userName.indexOf(' ') + 1);
  newUserData.login = newUserData.username;
  newUserData.password = crypto.createHmac('sha256', newUserData.phone).digest('hex');

  return models.Users.create(newUserData).then((createdUser) => {
    if (createdUser && createdUser.id) {
      return createUserAvatarImage(faker, createdUser.id);
    }
  });
};

const createUsers = (usersNumber) => {
  let promises = [];

  for (let i = 0; i < usersNumber; i++) {
    promises.push(createNewUser(faker).then(() => console.log(chalk.green(' ✔ new user created!'))));
  }

  return Promise.all(promises).then(() => {
    console.log(chalk.red(`\nTotal: ${usersNumber} added!`));
    models.sequelize.close();
  });
};

createUsers(2);

