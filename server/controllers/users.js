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

  // middlewares
  // check owner for current operation
  async checkOwner(ctx, next) {
    // console.log(ctx.state);
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(404, 'Forbidden!');
    }
    await next();
  }

  // check user exist or not
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, `User doesn't exist.`);
    }
    ctx.state.user = user;
    await next();
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
      email: {
        type: 'email',
        required: true,
      },
      password: {
        type: 'string',
        required: true,
      },
      name: {
        type: 'string',
        required: false,
      },
    });
    // check user exist or not
    const bodyData = ctx.request.body;
    const { email } = bodyData;
    const existUser = await User.findOne({
      email,
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
      email: {
        type: 'email',
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
      email: {
        type: 'email',
        required: true,
      },
      password: {
        type: 'string',
        required: true,
      },
    });

    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, 'Email or password not correct! ');
    }
    const { _id, name, email } = user;
    // generate token by id & name from user
    const token = jwt.sign(
      {
        _id,
        name,
        email,
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
