const Tag = require('../models/tags');

class TagController {
  async index(ctx) {
    ctx.body = 'Tag Page';
  }

  async getTagList(ctx) {
    const { query } = ctx;
    const { per_page = 10, page = 1, q = '' } = query;
    const currPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const queryStr = new RegExp(q);

    ctx.body = await Tag.find({
      name: queryStr,
    })
      .limit(perPage)
      .skip(currPage * perPage);
  }

  // get tag by id
  async getTagById(ctx) {
    const { fields = '' } = ctx.query;
    const { id } = ctx.params;
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ` +${f}`)
      .join('');

    const tag = await Tag.findById(id).select(selectFields);
    if (!tag) {
      ctx.throw(404, `Tag doesn't exist.`);
    }
    ctx.body = tag;
  }

  // create tag
  async createTag(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true,
      },
    });
    const tag = await new Tag(ctx.request.body).save();
    ctx.body = tag;
  }

  // update tag
  async updateTag(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false,
      },
    });
    const tag = await Tag.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = tag;
  }

  // delete tag
  async deleteTag(ctx) {
    const tag = await Tag.findByIdAndRemove(ctx.params.id);
    if (!tag) {
      ctx.throw(404, `Tag doesn't exist.`);
    }
    ctx.status = 204;
  }
}

module.exports = new TagController();
