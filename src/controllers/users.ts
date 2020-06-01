import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';

import User from '../models/users';
import Question from '../models/questions';
import Answer from '../models/answers';

import config from '../config';
const { secret } = config;

class UsersController {
  async checkOwner(ctx: Context, next: Next) {
    console.log(ctx.state);
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, 'Forbidden!');
    }
    await next();
  }

  async checkUserExist(ctx: Context, next: Next) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, 'User not exist');
    }
    ctx.state.user = user;
    await next();
  }

  index(ctx: Context) {
    ctx.body = 'Users page';
  }

  async login(ctx: Context) {
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
      ctx.throw(401, 'Username or password is incorrect!');
    }
    const { _id, name } = user;
    const token = jwt.sign({ _id, name }, secret, {
      expiresIn: '1d',
    });
    ctx.state.user = user;
    ctx.body = { token };
  }

  async find(ctx: Context) {
    const { per_page = 10, page = 1 } = ctx.query;
    const currPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);

    ctx.body = await User.find({
      name: new RegExp(ctx.query.q),
    })
      .limit(perPage)
      .skip(currPage * perPage);
  }

  async findById(ctx: Context) {
    const { fields = '' } = ctx.query;
    const selectedFields = fields
      .split(';')
      .filter((f) => f)
      .map((f) => ` +${f}`)
      .join('');
    const populateStr = fields
      .split(';')
      .filter((f) => f) // filter empty item
      .map((f) => {
        if (f === 'employments') {
          return 'employments.company employments.job';
        }
        if (f === 'educations') {
          return 'educations.school educations.major';
        }
        return f;
      })
      .join(' ');
    const id = ctx.params.id;
    const user = await await User.findById(id)
      .select(selectedFields)
      .populate(populateStr);

    if (!user) {
      ctx.throw(404, 'User not exist');
    }

    ctx.body = user;
  }

  async create(ctx: Context) {
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
    // console.log(ctx.request.body);
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({
      name,
    });
    if (repeatedUser) {
      ctx.throw(409, 'User has exist!');
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }

  async update(ctx: Context) {
    const id = ctx.params.id;
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false,
      },
      password: {
        type: 'string',
        required: false,
      },
      avatar_url: {
        type: 'string',
        required: false,
      },
      gender: {
        type: 'string',
        required: false,
      },
      headline: {
        type: 'string',
        required: false,
      },
      locations: {
        type: 'array',
        itemType: 'string',
        required: false,
      },
      business: {
        type: 'string',
        required: false,
      },
      employments: {
        type: 'array',
        itemType: 'object',
        required: false,
      },
      educations: {
        type: 'array',
        itemType: 'object',
        required: false,
      },
    });
    const user = await User.findByIdAndUpdate(id, ctx.request.body);
    if (!user) {
      ctx.throw(404, 'User not exist');
    }
    ctx.body = user;
  }

  async delete(ctx: Context) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx.throw(404, 'User not exist');
    }
    ctx.status = 204;
  }

  async listFollowing(ctx: Context) {
    const user = await User.findById(ctx.params.id)
      .select('+following')
      .populate('following');

    if (!user) {
      ctx.throw(404);
    }
    ctx.body = user.following;
  }

  async listFollowers(ctx: Context) {
    const users = await User.find({
      following: ctx.params.id,
    });
    ctx.body = users;
  }

  async follow(ctx: Context) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    if (
      !me.following.map((id: string) => id.toString()).includes(ctx.params.id)
    ) {
      me.following.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }

  async unfollow(ctx: Context) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    const index = me.following
      .map((id: string) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }

  async followTopic(ctx: Context) {
    const me = await User.findById(ctx.state.user._id).select(
      '+followingTopics'
    );
    if (
      !me.followingTopics
        .map((id: string) => id.toString())
        .includes(ctx.params.id)
    ) {
      me.followingTopics.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }

  async unfollowTopic(ctx: Context) {
    const me = await User.findById(ctx.state.user._id).select(
      '+followingTopics'
    );
    const index = me.followingTopics
      .map((id: string) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }

  async listFollowingTopics(ctx: Context) {
    const user = await User.findById(ctx.params.id)
      .select('+followingTopics')
      .populate('followingTopics');

    if (!user) {
      ctx.throw(404, 'User not exist.');
    }
    ctx.body = user.followingTopics;
  }

  async listQuestions(ctx: Context) {
    const questions = await Question.find({
      questioner: ctx.params.id,
    });
    ctx.body = questions;
  }

  async likeAnswer(ctx: Context, next: Next) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
    if (
      !me.likingAnswers
        .map((id: string) => id.toString())
        .includes(ctx.params.id)
    ) {
      me.likingAnswers.push(ctx.params.id);
      me.save();
      await Answer.findByIdAndUpdate(ctx.params.id, {
        $inc: {
          voteCount: 1,
        },
      });
    }
    ctx.status = 204;
    await next();
  }

  async unlikeAnswers(ctx: Context) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
    const index = me.likingAnswers
      .map((id: string) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.likingAnswers.splice(index, 1);
      me.save();
      await Answer.findByIdAndUpdate(ctx.params.id, {
        $inc: {
          voteCount: -1,
        },
      });
    }
    ctx.status = 204;
  }

  async listLikingAnswers(ctx: Context) {
    const user = await User.findById(ctx.params.id)
      .select('+likingAnswers')
      .populate('likingAnswers');

    if (!user) {
      ctx.throw(404, 'User not exist.');
    }
    ctx.body = user.likingAnswers;
  }

  async dislikeAnswer(ctx: Context, next: Next) {
    const me = await User.findById(ctx.state.user._id).select(
      '+dislikingAnswers'
    );
    if (
      !me.dislikingAnswers
        .map((id: string) => id.toString())
        .includes(ctx.params.id)
    ) {
      me.dislikingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }

  async undislikeAnswers(ctx: Context) {
    const me = await User.findById(ctx.state.user._id).select(
      '+dislikingAnswers'
    );
    const index = me.dislikingAnswers
      .map((id: string) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.dislikingAnswers.splice(index, 1);
    }
    ctx.status = 204;
  }

  async listDislikingAnswers(ctx: Context) {
    const user = await User.findById(ctx.params.id)
      .select('+dislikingAnswers')
      .populate('dislikingAnswers');

    if (!user) {
      ctx.throw(404, 'User not exist.');
    }
    ctx.body = user.dislikingAnswers;
  }

  async collectingAnswer(ctx: Context, next: Next) {
    const me = await User.findById(ctx.state.user._id).select(
      '+collectingAnswers'
    );
    if (
      !me.collectingAnswers
        .map((id: string) => id.toString())
        .includes(ctx.params.id)
    ) {
      me.collectingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }

  async uncollectingAnswers(ctx: Context) {
    const me = await User.findById(ctx.state.user._id).select(
      '+collectingAnswers'
    );
    const index = me.collectingAnswers
      .map((id: string) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.collectingAnswers.splice(index, 1);
    }
    ctx.status = 204;
  }

  async listCollectingAnswers(ctx: Context) {
    const user = await User.findById(ctx.params.id)
      .select('+collectingAnswers')
      .populate('collectingAnswers');

    if (!user) {
      ctx.throw(404, 'User not exist.');
    }
    ctx.body = user.collectingAnswers;
  }
}

const usersCtrl = new UsersController();

export default usersCtrl;
