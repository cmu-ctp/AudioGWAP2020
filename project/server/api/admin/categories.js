/**
 * categories.js
 * Routes for editing categories
 */

const Router = require('koa-router');
const Category = require('../../models/sound_category');

const userAuth = require('../../lib/session').authRole;

const router = new Router();

router.use(userAuth({ blockRequest: true, roleRequired: 1 }));

//TODO: Add routes for editing categories (Add category, edit category)
router.get('/', async (ctx) => {
  const uid = ctx.user.uid;

  const userModel = new User(ctx);
  const userInfo = await userModel.findByUid(uid);

  ctx.body = {
    'msg': 'Success',
    'result': userInfo
  };
});

module.exports = router;