import { Context, Next } from 'koa';

import Answer from '../models/answers';
// import User from '../models/users';

class AnswersController {
  async checkAnswerer(ctx: Context, next: Next) {
    const { answer } = ctx.state;
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(403, 'Not authorization');
    }
    await next();
  }

  async checkAnswerExist(ctx: Context, next: Next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer');
    if (!answer) {
      ctx.throw(404, 'Answer not exist');
    }
    // only get/post/delete
    if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, 'Question has not this answer');
    }
    ctx.state.answer = answer;
    await next();
  }

  async find(ctx: Context) {
    const { per_page = 10, page = 1 } = ctx.query;
    const currPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const q = new RegExp(ctx.query.q);

    ctx.body = await Answer.find({
      content: q,
      questionId: ctx.params.questionId,
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

    const answer = await Answer.findById(ctx.params.id)
      .select(selectFields)
      .populate('answerer');
    ctx.body = answer;
  }

  async create(ctx: Context) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: true,
      },
      description: {
        type: 'string',
        required: false,
      },
    });
    const answerer = ctx.state.user._id;
    const { questionId } = ctx.params;
    const answer = await new Answer({
      ...ctx.request.body,
      answerer,
      questionId,
    }).save();
    ctx.body = answer;
  }

  async update(ctx: Context) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: false,
      },
    });
    await ctx.state.answer.update(ctx.request.body);
    ctx.body = ctx.state.answer;
  }

  async delete(ctx: Context) {
    await Answer.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

const answersCtrl = new AnswersController();

export default answersCtrl;
