import { Context, Next } from 'koa';

import Topic from '../models/topics';
import User from '../models/users';
import Question from '../models/questions';

class TopicsController {
  async checkTopicExist(ctx: Context, next: Next) {
    const topic = await Topic.findById(ctx.params.id);
    if (!topic) {
      ctx.throw(404, 'Topic not exist');
    }
    await next();
  }

  async find(ctx: Context) {
    const { per_page = 10, page = 1 } = ctx.query;
    const currPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);

    ctx.body = await Topic.find({
      name: new RegExp(ctx.query.q),
    })
      .limit(perPage)
      .skip(currPage * perPage);
  }

  async findById(ctx: Context) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((f) => f)
      .map((f) => ` +${f}`)
      .join('');

    const topic = await Topic.findById(ctx.params.id).select(selectFields);
    ctx.body = topic;
  }

  async create(ctx: Context) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true,
      },
      avatar_url: {
        type: 'string',
        required: false,
      },
      introduction: {
        type: 'string',
        required: false,
      },
    });
    const topic = await new Topic(ctx.request.body).save();
    ctx.body = topic;
  }

  async update(ctx: Context) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false,
      },
      avatar_url: {
        type: 'string',
        required: false,
      },
      introduction: {
        type: 'string',
        required: false,
      },
    });
    const topic = await Topic.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    );
    ctx.body = topic;
  }

  async listTopicFollowers(ctx: Context) {
    const users = await User.find({
      followingTopics: ctx.params.id,
    });
    ctx.body = users;
  }

  async listQuestions(ctx: Context) {
    const questions = await Question.find({
      topics: ctx.params.id,
    });
    ctx.body = questions;
  }
}

const topicsCtrl = new TopicsController();

export default topicsCtrl;
