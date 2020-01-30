/**
 * Users Controller
 */

const User = require('../models/users');

class UsersController {
  async index(ctx) {
    ctx.body = 'Users Page';
  }

  // get user list
  async getList(ctx) {
    ctx.body = await User.find();
  }

  // create new user
  async createUser(ctx) {
    // verify parameters
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true,
      },
      password: {
        type: 'string',
        required: true,
      },
    });
    // check user exist or not
    const bodyData = ctx.request.body;
    const { name } = bodyData;
    const existUser = await User.findOne({
      name,
    });
    if (existUser) {
      ctx.throw(409, 'User already exists.');
    }
    const user = await new User(bodyData).save();
    ctx.body = user;
  }
}

module.exports = new UsersController();
