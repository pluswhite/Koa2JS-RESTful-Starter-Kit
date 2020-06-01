import { Context, Next } from 'koa';

import Question from '../models/questions';
// import User from '../models/users';

class QuestionsController {
  async checkQuestioner(ctx: Context, next: Next) {
    const { question } = ctx.state;
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, 'Not authorization');
    }
    await next();
  }

  async checkQuestionExist(ctx: Context, next: Next) {
    const question = await Question.findById(ctx.params.id).select(
      '+questioner'
    );
    if (!question) {
      ctx.throw(404, 'Question not exist');
    }
    ctx.state.question = question;
    await next();
  }

  async find(ctx: Context) {
    const { per_page = 10, page = 1, q = '' } = ctx.query;
    const currPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);

    ctx.body = await Question.find({
      $or: [
        {
          title: q,
        },
        {
          description: q,
        },
      ],
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

    const question = await Question.findById(ctx.params.id)
      .select(selectFields)
      .populate('questioner topics');
    ctx.body = question;
  }

  async create(ctx: Context) {
    ctx.verifyParams({
      title: {
        type: 'string',
        required: true,
      },
      description: {
        type: 'string',
        required: false,
      },
    });
    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id,
    }).save();
    ctx.body = question;
  }

  async update(ctx: Context) {
    ctx.verifyParams({
      title: {
        type: 'string',
        required: false,
      },
      description: {
        type: 'string',
        required: false,
      },
    });
    await ctx.state.question.update(ctx.request.body);
    ctx.body = ctx.state.question;
  }

  async delete(ctx: Context) {
    await Question.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

const questionsCtrl = new QuestionsController();

export default questionsCtrl;
