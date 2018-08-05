const models = require('../models');

const Controller = require('./Controller');

class ChatsUsersController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  getAction() {
    const { req } = this;
    const { userData, urlParams } = req;
    const { friendId } = urlParams;

    if (friendId) {
      models.ChatsUsers.findAll({
        where: {
          user_id: userData.user_id
        }
      }).then((chatsList) => {
        const idsList = chatsList.map(chat => chat.chat_id);

        models.ChatsUsers.find({
          where: {
            user_id: friendId,
            chat_id: {
              $in: idsList
            }
          }
        }).then((response) => {
          if (response) {
            this.response = response;
            return this.returnInformation();
          }
          this.code = 404;
          return this.returnInformation();
        });
      });
    } else {
      this.code = 422;
      this.returnInformation();
    }
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
