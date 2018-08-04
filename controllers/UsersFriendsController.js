const models = require('../models');
const Controller = require('./Controller');
const SearchController = require('./SearchController');

class UsersFriendsController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  getAction() {
    const {
      userId, limit = 20, offset = 0, search, token, idsOnly, where, relations
    } = this.req.urlParams;

    if (idsOnly) {
      return this.returnFriendsIdsList();
    }

    if (search && token) {
      return this.searchFriends(search);
    }

    models.UsersFriends.findAndCountAll({
      include: relations,
      where,
      limit: Number(limit),
      offset: Number(offset)
    }).then((response) => {
      if (!response.count) {
        this.code = 404;
      }
      this.total = response.count;
      this.response = response.rows;
      this.returnInformation();
    });
  }

  postAction() {
    const { urlParams } = this.req;
    if (urlParams && urlParams.submitFriend) {
      return this.submitFriend();
    }
    if (urlParams && urlParams.rejectFriend) {
      return this.rejectFriend();
    }
    return this.addNewFriend();
  }

  delAction() {
    this.deleteFriend();
  }

  submitFriend() {
    const { userData, urlParams, socketsData } = this.req;
    const { io } = socketsData;

    const submittedUserSocket = global.participants.find((participant) =>
      Number(participant.userId) === Number(urlParams.userId));

    if (!userData) {
      this.code = 403;
      this.returnInformation();
    }

    models.UsersFriends.findOne({
      where: {
        user_id: userData.user_id,
        friend_id: urlParams.userId
      }
    }).then((item) => {
      item.accepted = 1;
      item.save()
        .then(() => {
          models.UsersFriends.findOne({
            where: {
              user_id: urlParams.userId,
              friend_id: userData.user_id
            }
          }).then((initialItem) => {
            initialItem.accepted = 1;
            initialItem.save().then(() => {
              if (submittedUserSocket && submittedUserSocket.socketId) {
                io.sockets.connected[submittedUserSocket.socketId].emit('submitting_new_friend', userData);
              }
              this.setResponseData({ response: { updated: true } });
              this.returnInformation();
            });
          });
        });
    });
  }

  rejectFriend() {
    const { userData, urlParams, socketsData } = this.req;
    const { io } = socketsData;

    const rejectedUserSocket = global.participants.find((participant) =>
      Number(participant.userId) === Number(urlParams.userId));

    if (!userData) {
      this.code = 403;
      this.returnInformation();
    }

    models.UsersFriends.destroy({
      where: {
        user_id: userData.user_id,
        friend_id: urlParams.userId
      }
    }).then(() => {
      models.UsersFriends.findOne({
        where: {
          user_id: urlParams.userId,
          friend_id: userData.user_id
        }
      }).then((initialItem) => {
        initialItem.accepted = -1;
        initialItem.save().then(() => {
          if (rejectedUserSocket && rejectedUserSocket.socketId) {
            io.sockets.connected[rejectedUserSocket.socketId].emit('rejecting_new_friend', userData);
          }
          this.setResponseData({ response: { updated: true } });
          this.returnInformation();
        });
      });
    });
  }

  returnFriendsIdsList() {
    const { userData } = this.req;
    models.UsersFriends.findAndCountAll({
      where: {
        user_id: userData.user_id,
        accepted: {
          $in: [0, 1]
        }
      }
    }).then((friends) => {
      const idsList = friends && friends.rows && friends.rows.length
        ? friends.rows.map(friend =>
          ({
            userId: friend.friend_id,
            accepted: friend.accepted
          })
        )
        : [];
      this.setResponseData({ response: { idsList, total: friends.count }, total: friends.count });
      this.returnInformation();
    });
  }

  searchFriends(searchString) {
    const { limit = 20, offset = 0 } = this.req.urlParams;
    const { userData } = this.req;

    const search = new SearchController();

    if (!userData) {
      this.code = 403;
      this.returnInformation();
    }

    models.UsersFriends.findAndCountAll({
      where: {
        user_id: userData.user_id,
      },
      limit: Number(limit),
      offset: Number(offset)
    }).then((response) => {
      if (!response.count) {
        this.code = 404;
        this.returnInformation();
      }

      const idsToFindFrom = response.rows.map(item => item.friend_id);
      search.searchAction(null, searchString, idsToFindFrom, Number(limit), Number(offset))
        .then((response) => {
          if (response && response.hits && response.hits.length) {
            const idsList = response.hits.map((item, index) =>
              ({ id: Number(item._id), order: index + 1 }));
            this.response = { searchString, idsList };

            this.returnInformation();
          }
        });
    }).catch(() => {
      this.code = 404;
      this.returnInformation();
    });
  }

  addNewFriend() {
    const { userData, urlParams, socketsData } = this.req;
    const { io } = socketsData;

    const friendSocket = global.participants.find((participant) =>
      Number(participant.userId) === Number(urlParams.userId));

    if (userData) {
      models.UsersFriends.destroy({
        where: {
          user_id: userData.user_id,
          friend_id: urlParams.userId,
        }
      }).catch(() => {});
      models.UsersFriends.create({
        user_id: userData.user_id,
        friend_id: urlParams.userId,
        accepted: 0
      }).then(() => {
        models.UsersFriends.create({
          user_id: urlParams.userId,
          friend_id: userData.user_id,
          accepted: 2
        }).then(() => {
          if (friendSocket && friendSocket.socketId) {
            io.sockets.connected[friendSocket.socketId].emit('adding_new_friend', userData);
          }
          this.setResponseData({ response: { success: true } });
          this.returnInformation();
        });
      }).catch((err) => {
        this.res.json(err);
      });
    } else {
      this.code = 403;
      this.returnInformation();
    }
  }

  deleteFriend() {
    const { userData, urlParams } = this.req;

    if (userData) {
      models.UsersFriends.destroy({
        where: {
          user_id: userData.user_id,
          friend_id: urlParams.friendId
        }
      }).then(() => {
        models.UsersFriends.destroy({
          where: {
            user_id: urlParams.friendId,
            friend_id: userData.user_id
          }
        }).then(() => {
          this.setResponseData({ response: { success: true } });
          this.returnInformation();
        });
      }).catch((err) => {
        this.res.json(err);
      });
    } else {
      this.code = 403;
      this.returnInformation();
    }
  }
}

module.exports = UsersFriendsController;
