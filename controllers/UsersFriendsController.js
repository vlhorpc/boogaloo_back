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
    const { userId, limit = 20, offset = 0, search, token } = this.req.urlParams;

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
            const idsList = response.hits.map(item => Number(item._id));
            this.response = {
              searchString,
              idsList
            };
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
