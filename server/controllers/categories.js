const Category = require('../models/categories');

class CategoryController {
  async index(ctx) {
    ctx.body = 'Category Page';
  }

  async getCategoryList(ctx) {
    const { query } = ctx;
    const { per_page = 10, page = 1, q = '' } = query;
    const currPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const queryStr = new RegExp(q);

    ctx.body = await Category.find({
      name: queryStr,
    })
      .limit(perPage)
      .skip(currPage * perPage);
  }

  // get category by id
  async getCategoryById(ctx) {
    const { fields = '' } = ctx.query;
    const { id } = ctx.params;
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ` +${f}`)
      .join('');

    const category = await Category.findById(id).select(selectFields);
    if (!category) {
      ctx.throw(404, `Category doesn't exist.`);
    }
    ctx.body = category;
  }

  // create category
  async createCategory(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true,
      },
    });
    const category = await new Category(ctx.request.body).save();
    ctx.body = category;
  }

  // update category
  async updateCategory(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false,
      },
    });
    const category = await Category.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body,
    );
    ctx.body = category;
  }

  // delete category
  async deleteCategory(ctx) {
    const category = await Category.findByIdAndRemove(ctx.params.id);
    if (!category) {
      ctx.throw(404, `Category doesn't exist.`);
    }
    ctx.status = 204;
  }
}

module.exports = new CategoryController();
