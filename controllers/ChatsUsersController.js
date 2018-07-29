const models = require('../models');

const Controller = require('./Controller');

class ChatsUsersController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  putAction() {
    const { req } = this;
    const { body: bodyParams, userData } = req;

    models.ChatsUsers.find({
      where: {
        user_id: userData.user_id,
        chat_id: bodyParams.chatId
      }
    }).then((chatUser) => {
      if (chatUser) {
        chatUser.last_read_message_id = bodyParams.messageId;
        chatUser.save();
        return this.returnInformation();
      } else {
        this.code = 404;
        this.returnInformation();
      }
    }).catch(() => {
      this.code = 404;
      this.returnInformation();
    });
  }
}

module.exports = ChatsUsersController;
