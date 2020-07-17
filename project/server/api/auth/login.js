/* eslint-disable require-atomic-updates */
/**
 * login.js
 * Streamer event routes.
 */

const Router = require('koa-router');

const Twitch = require('../../lib/twitch');
const userAuth = require('../../lib/session').auth;

const router = new Router();

/**
 * GET /auth/login
 * Log into the application.
 */
router.get('/auth/login', async (ctx) => {
  // if (ctx.user) {
  //   ctx.throw(409, 'User already logged in');
  // }

  ctx.redirect('/api/connect/twitch/web');
});

/**
 * GET /auth/adminlogin
 * Log into the admin panel.
 */
router.get('/auth/adminlogin', async (ctx) => {
  ctx.redirect('/api/connect/twitch/admin');
});

/**
 * GET /auth/logout
 * Log out from the applicatin.
 */
router.get('/auth/logout', userAuth(), async (ctx) => {
  const tokenInfo = ctx.token;
  if (tokenInfo) {
    const twitch = new Twitch(tokenInfo);
    await twitch.revokeTokens();
  }

  ctx.session = null;
  ctx.redirect('/');
});

/**
 * GET /auth/applogin
 * Log into the mobile app.
 */
router.get('/auth/applogin', async (ctx) => {
  // if (ctx.user) {
  //   ctx.throw(409, 'User already logged in');
  // }

  ctx.redirect('/api/connect/twitch/token');
});

module.exports = router;
