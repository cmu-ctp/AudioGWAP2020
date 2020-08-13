/**
 * categories.js
 * Interface categories routes.
 */

const Router = require('koa-router');
const Category = require('../../models/sound_categories');

const router = new Router();

/**
 * GET /pub/categories
 * Gets all categories, returns as object with each key being a parent
 * category, and each key containing an array of the subcategories assigned
 * to that parent.
 */
router.get('/categories', async (ctx) => {
  const CategoryModel = new Category(ctx);
  const categoryInfo = await CategoryModel.getAllCategories();

  ctx.body = {
    'msg': 'Success',
    'categories': categoryInfo
  }
})

/**
 * GET /pub/categories/:parent
 * Gets all subcategories of the parent category specified by :parent.
 * If parent category doesn't exist, throws a 404 error.
 */
router.get('/categories/:parent', async (ctx) => {
  const CategoryModel = new Category(ctx);
  const parent = CategoryModel.convertCase(ctx.params.parent);
  const categoryInfo = await CategoryModel.findByParent(parent);

  if (categoryInfo.length === 0) {
    ctx.throw(404, 'Parent category not found')
  }

  ctx.body = {
    'msg': 'Success',
    'parent': parent,
    'sub_categories': categoryInfo
  }
})

module.exports = router;