/**
 * test.js
 * Test routes to ensure authentication works correctly.
 */

const Router = require('koa-router');
const User = require('../../models/user');

const userAuth = require('../../lib/session').authRole;

const router = new Router();

router.use(userAuth({ blockRequest: true, roleRequired: 2 }));

router.get('/test', async (ctx) => {
  const uid = ctx.user.uid;

  const userModel = new User(ctx);
  const userInfo = await userModel.findByUid(uid);

  ctx.body = {
    'msg': 'Success',
    'result': userInfo
  };
});

module.exports = router;