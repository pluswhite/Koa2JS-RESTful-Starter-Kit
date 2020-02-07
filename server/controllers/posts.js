/**
 * Post Controller
 */
const Post = require('../models/posts');
const User = require('../models/users');

class PostController {
  async getPostList(ctx) {
    const { query } = ctx;
    const { per_page = 10, page = 1, q = '' } = query;
    const currPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const queryStr = new RegExp(q);

    ctx.body = await Post.find({
      content: queryStr,
    })
      .limit(perPage)
      .skip(currPage * perPage)
      .populate('author tags category');
  }

  async getPostById(ctx) {
    const { fields = '' } = ctx.query;
    const { id } = ctx.params;
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ` +${f}`)
      .join('');

    const post = await Post.findById(id).select(selectFields);
    if (!post) {
      ctx.throw(404, `Post doesn't exist.`);
    }
    ctx.body = post;
  }

  async createPost(ctx) {
    ctx.verifyParams({
      title: {
        type: 'string',
        required: true,
      },
      avatar: {
        type: 'string',
        required: false,
      },
      content: {
        type: 'string',
        required: false,
      },
    });
    const author = ctx.state.user._id;
    const post = await new Post({
      ...ctx.request.body,
      author,
    }).save();
    ctx.body = post;
  }

  async updatePost(ctx) {
    ctx.verifyParams({
      title: {
        type: 'string',
        required: false,
      },
      avatar: {
        type: 'string',
        required: false,
      },
      content: {
        type: 'string',
        required: false,
      },
    });
    const post = await Post.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = post;
  }

  async deletePost(ctx) {
    await Post.findOneAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new PostController();
