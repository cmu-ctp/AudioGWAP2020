/**
 * session.js
 * Session adapter.
 */

const koaSession = require('koa-session');
const config = require('../config');

class Session {
  static register(app) {
    return koaSession(app);
  }

  static auth(opt) {
    opt = Object.assign({
      blockRequest: false
    }, opt);

    return async (ctx, next) => {
      // Check if the user is logged in
      //console.log(ctx.state);
      if (ctx.session && ctx.session.user && ctx.session.token) {
        ctx.user = ctx.session.user;
        ctx.token = ctx.session.token;
      } else if (ctx.state.user && ctx.state.user.uid && ctx.state.user.token) {
        ctx.user = {
          uid: ctx.state.user.uid   // Only uid can be fetched from JWT
        };
        ctx.token = ctx.state.user.token;
      } else if (opt.blockRequest) {
        ctx.throw(401, 'Unauthorized');
      }

      await next();
    };
  }

  constructor(ctx) {
    this.state = ctx.state;
    this.session = ctx.session;
  }

  setUser(userInfo) {
    this.session.user = userInfo;
  }

  setTokens(tokenInfo) {
    this.session.token = tokenInfo;
  }

  getUser() {
    return this.session.user || this.state.user;
  }

  getTokens() {
    return this.session.token || this.state.token;
  }
}

module.exports = Session;
