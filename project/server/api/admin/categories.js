/**
 * categories.js
 * Routes for editing categories
 */

const Router = require('koa-router');
const Category = require('../../models/sound_categories');
const Joi = require('@hapi/joi');

const userAuth = require('../../lib/session').authRole;

const router = new Router();

const categorySchema = Joi.object({
  parent: Joi.string(),
  sub: Joi.string()
}).min(2);

const updateCategorySchema = Joi.object({
  parent: Joi.string(),
  sub: Joi.string()
}).min(1);

router.use(userAuth({ blockRequest: true, roleRequired: 1 }));

/**
 * @api {POST} /admin/categories Add New Category
 * @apiName AddCategory
 * @apiGroup Admin
 * @apiDescription Add a new category to the list of categories
 * 
 * @apiParam  {String} parent Parent category name
 * @apiParam  {String} sub    Category name (technically subcategory)
 * @apiParamExample  {x-www-form-urlencoded} Request-Example:
 *    parent=Kitchen&sub=Cooking
 * 
 * @apiSuccess {String} id    ObjectId of category in database
 * @apiSuccessExample {json} Success-Response:
 * {
 *     msg: 'Success'
 *     id: '3fe4576928a4b2bc9c'
 * }
 * 
 * @apiPermission admin
 * 
 * @apiUse BadRequest
 * @apiUse Unauthorized
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
    const idObj = await CategoryModel.addNewCategory(categoryData.parent, categoryData.sub);
    //addNewCategory returns null if it already exists
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
 * @api {PUT} /admin/categories/:id Update Category
 * @apiName UpdateCategory
 * @apiGroup Admin
 * @apiDescription Update the category designated by the given ID
 * 
 * @apiParam  {String} id       ObjectId of category in database
 * @apiParam  {String} [parent] New parent category name (Only 1 of parent and sub must be present)
 * @apiParam  {String} [sub]    New category name (technically subcategory)
 * @apiParamExample  {json} Request-Example:
 * {
 *     parent: 'Kitchen'
 *     sub: 'Dishwasher'
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     msg: 'Success'
 * }
 * 
 * @apiPermission admin
 * 
 * @apiUse BadRequest
 * @apiUse Unauthorized
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