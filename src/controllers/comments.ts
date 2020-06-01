import { Context, Next } from 'koa';

import Comment from '../models/comments';
// import User from '../models/users';

class CommentsController {
  async checkCommentator(ctx: Context, next: Next) {
    const { comment } = ctx.state;
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx.throw(403, 'Not authorization');
    }
    await next();
  }

  async checkCommentExist(ctx: Context, next: Next) {
    const comment = await Comment.findById(ctx.params.id).select(
      '+commentator'
    );
    if (!comment) {
      ctx.throw(404, 'Comment does not exist');
    }
    // only get/post/delete
    if (
      ctx.params.questionId &&
      comment.questionId.toString() !== ctx.params.questionId
    ) {
      ctx.throw(404, 'Question has not this comment');
    }

    if (
      ctx.params.answerId &&
      comment.answerId.toString() !== ctx.params.answerId
    ) {
      ctx.throw(404, 'Answer has not this comment');
    }
    ctx.state.comment = comment;
    await next();
  }

  async find(ctx: Context) {
    const { per_page = 10, page = 1 } = ctx.query;
    const currPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const q = new RegExp(ctx.query.q);
    const { questionId, answerId } = ctx.params;
    const { rootCommentId } = ctx.query;

    ctx.body = await Comment.find({
      content: q,
      questionId,
      answerId,
      rootCommentId,
    })
      .limit(perPage)
      .skip(currPage * perPage)
      .populate('commentator replyTo');
  }

  async findById(ctx: Context) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((f) => f)
      .map((f) => ` +${f}`)
      .join('');

    const comment = await Comment.findById(ctx.params.id)
      .select(selectFields)
      .populate('commentator');
    ctx.body = comment;
  }

  async create(ctx: Context) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: true,
      },
      rootCommentId: {
        type: 'string',
        required: false,
      },
      replyTo: {
        type: 'string',
        required: false,
      },
    });
    const commentator = ctx.state.user._id;
    const { questionId, answerId } = ctx.params;
    const comment = await new Comment({
      ...ctx.request.body,
      commentator,
      questionId,
      answerId,
    }).save();
    ctx.body = comment;
  }

  async update(ctx: Context) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: false,
      },
    });
    const { content } = ctx.request.body;
    await ctx.state.comment.update({
      content,
    });
    ctx.body = ctx.state.comment;
  }

  async delete(ctx: Context) {
    await Comment.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

const commentsCtrl = new CommentsController();

export default commentsCtrl;
