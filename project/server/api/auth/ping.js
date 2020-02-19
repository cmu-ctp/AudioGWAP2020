/* eslint-disable require-atomic-updates */
/**
 * ping.js
 * Ping routers.
 */

const Router = require('koa-router');

const router = new Router();

/**
 * GET /ping
 * Log into the application.
 */
router.get('/ping', async (ctx) => {
  ctx.body = {
    'msg': 'Ok'
  };
});

module.exports = router;
