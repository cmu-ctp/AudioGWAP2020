/**
 * categories.js
 * Routes for editing categories
 */

const Router = require('koa-router');
const Category = require('../../models/sound_category');
const Joi = require('@hapi/joi');

const userAuth = require('../../lib/session').authRole;

const router = new Router();

const categorySchema = Joi.object({
  parent: Joi.string().alphanum().allow('/', '-'),
  sub: Joi.string().alphanum().allow('/', '-')
}).min(2);

const updateCategorySchema = Joi.object({
  parent: Joi.string().alphanum().allow('/', '-'),
  sub: Joi.string().alphanum().allow('/', '-')
}).min(1);

router.use(userAuth({ blockRequest: true, roleRequired: 1 }));

/**
 * POST /admin/categories
 * Add a new category to the list of categories
 * 
 * Send with url-encoded format with following parameters:
 * parent='name of parent category'
 * sub='name of subcategory'
 */
router.post('/categories', async (ctx) => {
  // console.log(ctx.request.body);
  let categoryData = Object.create(ctx.request.body);

  try {
    categoryData = await categorySchema.validateAsync(categoryData);
  } catch (err) {
    ctx.throw(400, err);
  }

  // console.log(categoryData);
  
  const CategoryModel = new Category(ctx);
  try {
    const idObj = await CategoryModel.addCategory(categoryData.parent, categoryData.sub);
    //addCategory returns null if it already exists
    if (!idObj) {
      ctx.throw(400, 'Category already exists');
    }
    console.log('Successfully added!');
    // console.log(idObj);
    ctx.body = {
      'msg': 'Success',
      'id': idObj.id
    };
  } catch (err) {
    console.log(err);
    ctx.throw(500, err);
  }
});

/**
 * PUT /admin/categories/:id
 * Update the category designated by :id
 * 
 * Request should be in json form, as follows:
 * {
 *    parent: 'name of new parent'
 *    sub: 'new subcategory name'
 * }
 * 
 * If any fields aren't present, the end point will assume that field shouldn't be changed.
 */
router.put('/categories/:id', async (ctx) => {
  const id = ctx.params.id;
  // console.log(ctx.request.body);
  let categoryData = Object.create(ctx.request.body);
  let CategoryModel = new Category(ctx);
  const category = await CategoryModel.find(id);

  if (category === null) {
    ctx.throw(404, 'Category not found');
  }

  try {
    categoryData = await updateCategorySchema.validateAsync(categoryData);
  } catch (err) {
    ctx.throw(400, err);
  }

  try {
    await CategoryModel.update(id, categoryData);
    ctx.body = {
      'msg': 'Success'
    };
  } catch (err) {
    console.log(err);
    ctx.throw(500, err);
  }
});

/**
 * DELETE /admin/categories/:id
 * Deletes the category designated by id
 */
router.delete('/categories/:id', async (ctx) => {
  const id = ctx.params.id;
  const CategoryModel = new Category(ctx);
  const category = await CategoryModel.find(id);

  if (category === null) {
    ctx.throw(404, 'Category not found');
  }

  try {
    await CategoryModel.remove(id);
    ctx.body = {
      'msg': 'Success',
      'Removed Category': category.parent + '/' + category.sub
    };
  } catch (err) {
    console.log(err);
    ctx.throw(500, err);
  }
});

module.exports = router;