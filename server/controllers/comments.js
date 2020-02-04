const Comment = require('../models/comments');

class CommentController {
  async getCommentList(ctx) {
    const { query, params } = ctx;
    const { per_page = 10, page = 1, q = '', rootCommentId } = query;
    const currPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const queryStr = new RegExp(q);
    const { postId } = params;

    ctx.body = await Comment.find({
      content: queryStr,
      postId,
      rootCommentId,
    })
      .limit(perPage)
      .skip(currPage * perPage)
      .populate('commentator replyTo');
  }

  async getCommentById(ctx) {
    const { fields = '' } = ctx.query;
    const { id } = ctx.params;
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ` +${f}`)
      .join('');

    const comment = await Comment.findById(id)
      .select(selectFields)
      .populated('commentator');
    if (!comment) {
      ctx.throw(404, `Comment doesn't exist.`);
    }
    ctx.body = comment;
  }

  async createComment(ctx) {
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
    const { postId } = ctx.params;
    const comment = await new Comment({
      ...ctx.request.body,
      commentator,
      postId,
    }).save();
    ctx.body = comment;
  }

  async updateComment(ctx) {
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

  async deleteComment(ctx) {
    await Comment.findOneAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new CommentController();
