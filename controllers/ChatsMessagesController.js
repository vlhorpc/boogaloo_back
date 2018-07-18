const models = require('../models');
const crypto = require('crypto');
const url = require('url');
const moment = require('moment');
const Controller = require('./Controller');

class ChatsMessagesController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  getAction() {
    const { req, res } = this;
    const { userData, urlParams } = req;
    const { limit, offset } = urlParams;

    models.ChatsUsers.find({
      where: {
        user_id: userData.user_id,
        chat_id: urlParams.chat_id
      }
    }).then((currentChat) => {
      if (currentChat) {
        models.ChatsMessages
          .findAll({
            where: {
              chat_id: urlParams.chat_id
            },
            limit: Number(limit) || 10,
            offset: Number(offset) || 0,
            order: [
              ['createdAt', 'DESC']
            ]
          })
          .then((messages) => {
            this.setResponseData({ response: messages });
            return this.returnInformation();
          })
          .catch(() => {
            this.code = 404;
            return this.returnInformation();
          });
      } else {
        this.code = 404;
        return this.returnInformation();
      }
    }).catch((err) => {
      this.setResponseData({ code: 422, message: err });
      return this.returnInformation();
    });
  }

  postAction() {
    const { req, res } = this;
    const { userData, urlParams, body: bodyParams } = req;

    models.ChatsUsers.find({
      where: {
        user_id: userData.user_id,
        chat_id: bodyParams.chat_id
      }
    }).then((currentChat) => {
      if (currentChat) {
        const messageInformation = bodyParams;
        messageInformation.user_id = userData.user_id;

        models.ChatsMessages.create(messageInformation)
          .then((createdMessage) => {
            this.setResponseData({ response: createdMessage });
            return this.returnInformation();
          })
          .catch(() => {
            this.code = 422;
            return this.returnInformation();
          });
      } else {
        this.code = 404;
        return this.returnInformation();
      }
    }).catch(() => {
      this.code = 404;
      return this.returnInformation();
    });
  }

  putAction() {
    this.res.json('putAction');
  }

  deleteAction() {
    this.res.json('deleteAction');
  }
}

module.exports = ChatsMessagesController;
