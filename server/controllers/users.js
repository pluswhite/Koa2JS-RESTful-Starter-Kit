/**
 * Users Controller
 */

const User = require('../models/users');

class UsersController {
  async index(ctx) {
    ctx.body = 'Users Page';
  }

  async getList(ctx) {
    ctx.body = await User.find();
  }
}

module.exports = new UsersController();
