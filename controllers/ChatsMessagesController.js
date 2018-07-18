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
    return this.res.json('getAction');
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
            this.setResponseData({ code: 404, response: createdMessage });
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
