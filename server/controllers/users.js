/**
 * Users Controller
 */
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { appSecret: secret } = require('../../config');

class UsersController {
  async index(ctx) {
    ctx.body = 'Users Page';
  }

  // get user list
  async getUserList(ctx) {
    ctx.body = await User.find();
  }

  // get user by id
  async getUserById(ctx) {
    const id = ctx.params.id;
    const user = await User.findById(id);
    if (!user) {
      ctx.throw(404, `User doesn't exist.`);
    }
    ctx.body = user;
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

  // update user
  async updateUser(ctx) {
    const id = ctx.params.id;
    const bodyData = ctx.request.body;
    // verify parameters
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false,
      },
      password: {
        type: 'string',
        required: false,
      },
      avatar: {
        type: 'string',
        required: false,
      },
      gender: {
        type: 'number',
        required: false,
      },
      locations: {
        type: 'array',
        itemType: 'number',
        required: false,
      },
    });
    // console.log(bodyData);
    const user = await User.findByIdAndUpdate(id, bodyData);
    if (!user) {
      ctx.throw(404, 'User does not exist');
    }
    ctx.body = user;
  }

  // delete user
  async deleteUser(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx.throw(404, `User doesn't exist.`);
    }
    ctx.status = 204;
  }

  // user login
  async userLogin(ctx) {
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

    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, 'Username or password not correct! ');
    }
    const { _id, name } = user;
    // generate token by id & name from user
    const token = jwt.sign(
      {
        _id,
        name,
      },
      secret,
      {
        expiresIn: '1d',
      },
    );
    ctx.state.user = user;
    ctx.body = { token };
  }
}

module.exports = new UsersController();
