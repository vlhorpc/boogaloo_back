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
    const { userId, limit = 20, offset = 0, search, token, idsOnly } = this.req.urlParams;

    if (idsOnly) {
      return this.returnFriendsIdsList();
    }

    if (search && token) {
      return this.searchFriends(search);
    }

    models.UsersFriends.findAndCountAll({
      where: {
        user_id: userId,
        accepted: 1
      },
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
    this.addNewFriend();
  }

  delAction() {
    this.deleteFriend();
  }

  returnFriendsIdsList() {
    const { userData } = this.req;
    models.UsersFriends.findAndCountAll({
      where: {
        user_id: userData.user_id,
        accepted: 1
      }
    }).then((friends) => {
      const idsList = friends && friends.rows && friends.rows.length
        ? friends.rows.map(friend => friend.friend_id)
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
        accepted: 1
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
    const { userData, urlParams } = this.req;

    if (userData) {
      models.UsersFriends.create({
        user_id: userData.user_id,
        friend_id: urlParams.userId,
        accepted: 0
      }).then(() => {
        this.setResponseData({ response: { success: true } });
        this.returnInformation();
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
        this.setResponseData({ response: { success: true } });
        this.returnInformation();
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
