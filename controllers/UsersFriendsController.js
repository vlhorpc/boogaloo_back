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
        user_id: userId
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

  returnFriendsIdsList() {
    const { userData } = this.req;
    models.UsersFriends.findAndCountAll({
      where: {
        user_id: userData.user_id
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
        user_id: userData.user_id
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
}

module.exports = UsersFriendsController;
