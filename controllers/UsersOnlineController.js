const Controller = require('./Controller');

class UsersOnlineController extends Controller {
  constructor(req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  getAction() {
    const { req } = this;
    const { urlParams } = req;
    const { userId } = urlParams;

    if (userId) {
      let usersIdsToCheck = userId.split(',');
      usersIdsToCheck = usersIdsToCheck.map((item) => Number(item));
      const onlineUsers =
        global.participants.filter(participant => usersIdsToCheck.includes(participant.userId));

      this.response = onlineUsers.map((user) => user.userId);
      this.returnInformation();
    } else {
      this.code = 422;
      return this.returnInformation();
    }
  }
}

module.exports = UsersOnlineController;
