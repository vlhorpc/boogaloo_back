const models = require('../models');
const crypto = require('crypto');
const url = require('url');
const moment = require('moment');
const Controller = require('./Controller');

class ChatsController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  getAction() {
    return this.res.json('getAction');
    // const { token, userId } = this.req.urlParams;

    // if (token && userId) {
    //   this.checkToken(this.req, this.res);
    // } else {
    //   this.loginUser(this.req, this.res);
    // }
  }

  postAction() {
    const { req, res } = this;
    const { urlParams } = req;

    if (urlParams.type === 'group') {
      return this.createGroupChat(req, res);
    }
    return this.createPrivateChat(req, res);
  }

  putAction() {
    const { userData, body: bodyParams } = this.req;

    models.Chats.findOne({
      where: {
        id: bodyParams.chatId
      }
    }).then((chat) => {
      if (chat) {
        if (chat.admin_id === userData.user_id) {

          chat.name = bodyParams.name;

          chat.save()
            .then((savedChat) => {
              this.response = savedChat;
              return this.returnInformation();
            })
            .catch((err) => this.res.json(err));
        } else {
          this.code = 403;
          return this.returnInformation();
        }
      } else {
        this.code = 404;
        this.returnInformation();
      }
    });
  }

  deleteAction() {
    this.res.json('deleteAction');
  }

  createPrivateChat(req, res) {
    const { urlParams, userData } = req;

    models.Chats.create({
      admin_id: userData.user_id,
      name: null,
      chat_type: 'private',
      last_message_time: new Date()
    }).then((createdChat) => {
      const promises = [];

      promises.push(models.ChatsUsers.create({
        chat_id: createdChat.id,
        user_id: userData.user_id
      }));
      promises.push(models.ChatsUsers.create({
        chat_id: createdChat.id,
        user_id: urlParams.userId
      }));

      return Promise.all(promises).then(() => {
        this.response = createdChat;
        this.returnInformation();
      });
    });
  }

  createGroupChat(req, res) {
    res.json('createGroupChat');
  }
}

module.exports = ChatsController;
