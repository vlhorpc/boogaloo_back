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
    const { req, res } = this;
    const { urlParams } = req;

    if (urlParams.userId) {
      return this.returnChatsListByUserId(req, res);
    }
    return this.returnChatsByConditions(req, res);
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

  returnChatsListByUserId(req) {
    const { urlParams, userData } = req;
    const { userId } = urlParams;

    if (Number(userId) === Number(userData.user_id)) {
      models.ChatsUsers.findAndCountAll({
        attributes: ['chat_id'],
        where: {
          user_id: userId
        }
      }).then((chats) => {
        this.total = chats.count;
        this.response = chats.rows;
        this.code = chats.count > 0 ? this.code : 404;
        this.returnInformation();
      });
    } else {
      this.code = 403;
      this.returnInformation();
    }
  }

  returnChatsByConditions(req, res) {
    const { urlParams } = req;
    const {
      limit, offset, relations, where, order
    } = urlParams;

    models.Chats.findAndCountAll({
      include: relations,
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      where,
      order: order && order.orderData
        ? order.orderFunction(order.orderData, 'Chats', models.sequelize) : null
    }).then((chats) => {
      this.total = chats.count;
      this.response = chats.rows;
      this.code = chats.count > 0 ? this.code : 404;
      this.returnInformation();
    });
  }

  createPrivateChat(req, res) {
    const { urlParams, userData, socketsData } = req;
    const { io } = socketsData;

    const currentChatParticipant = global.participants.find(participant =>
      Number(participant.userId) === Number(urlParams.userId));

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

      if (currentChatParticipant) {
        io.sockets.connected[currentChatParticipant.socketId].emit('add_new_chat_to_user', createdChat.id);
      }

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
