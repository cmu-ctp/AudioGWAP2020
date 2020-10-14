/* eslint-disable require-atomic-updates */
/**
 * Twitch.js
 * Twitch OAuth integration.
 */

const Router = require('koa-router');

const Twitch = require('../../lib/twitch');
const Session = require('../../lib/session');
const JWT = require('../../lib/jwt');
const User = require('../../models/user');
const util = require('./_util');
const config = require('../../config');

const router = new Router();

/**
 * GET /auth/twitch/web
 * Log into the streamer website.
 */
router.get('/auth/twitch/web', async (ctx) => {
  const tokenInfo = Object.create(null);
  tokenInfo.access_token = ctx.query.access_token || '';
  tokenInfo.refresh_token = ctx.query.refresh_token || '';
  console.log('Tokens');
  console.log(tokenInfo.refresh_token);
  console.log(tokenInfo.access_token);
  if (!tokenInfo.access_token) {
    ctx.throw(400, 'Server error on logging in. Please try again.');
  }

  const twitch = new Twitch(tokenInfo);
  const rawUserInfo = await twitch.getUserInfo();
  //console.log(rawUserInfo);
  const userInfo = util.extractUserInfo(rawUserInfo);

  const userModel = new User(ctx);
  await userModel.registerOrUpdate(userInfo);

  const session = new Session(ctx);
  session.setUser(userInfo);
  session.setTokens(tokenInfo);

  // ctx.body = {
  //   'msg': 'Success',
  //   'result': userInfo
  // };

  // Redirect to index page
  ctx.redirect('/');
});

/**
 * GET /auth/twitch/admin
 * Log into the admin panel on interface website.
 */
router.get('/auth/twitch/admin', async (ctx) => {
  const tokenInfo = Object.create(null);
  tokenInfo.access_token = ctx.query.access_token || '';
  tokenInfo.refresh_token = ctx.query.refresh_token || '';
  if (!tokenInfo.access_token) {
    ctx.throw(400, 'Server error on logging in. Please try again.');
  }

  const twitch = new Twitch(tokenInfo);
  const rawUserInfo = await twitch.getUserInfo();
  const userInfo = util.extractUserInfo(rawUserInfo);

  const userModel = new User(ctx);
  await userModel.registerOrUpdate(userInfo);
  const userDbEntry = await userModel.findByUid(userInfo.uid);

  const session = new Session(ctx);

  if (userDbEntry && userDbEntry.role) {
    session.setRole(userDbEntry.role);
  } else {
    session.setRole(0); //0 = viewer role, lowest role status (no access to admin features)
  }
  console.log(session.getRole());

  session.setUser(userInfo);
  session.setTokens(tokenInfo);

  // Redirect to admin panel page, change to final url (since on subdomain)
  ctx.redirect('/');
})

/**
 * GET /auth/twitch/token
 * Log into the viewer app.
 */
router.get('/auth/twitch/token', async (ctx) => {
  const tokenInfo = Object.create(null);
  tokenInfo.access_token = ctx.query.access_token || '';
  tokenInfo.refresh_token = ctx.query.refresh_token || '';
  if (!tokenInfo.access_token) {
    ctx.throw(400, 'Server error on logging in. Please try again.');
  }

  const twitch = new Twitch(tokenInfo);
  const rawUserInfo = await twitch.getUserInfo();
  //console.log(rawUserInfo);
  const userInfo = util.extractUserInfo(rawUserInfo);

  const userModel = new User(ctx);
  await userModel.registerOrUpdate(userInfo);

  const authToken = JWT.generateToken(userInfo, tokenInfo);
  ctx.cookies.set(config.session.jwt.cookie, authToken, { httpOnly: false });

  ctx.body = {
    'msg': 'Success',
    'result': {
      'token': authToken,
      'type': 'Bearer'
    }
  };
});

module.exports = router;
