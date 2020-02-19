/**
 * Json Web Token Adapter.
 */

const koaJwt = require('koa-jwt');
const jwt = require('jsonwebtoken');

const config = require('../config');

class JWT {
  static register() {
    const jwtConfig = Object.assign({
      passthrough: true
    }, config.session.jwt);

    return koaJwt(jwtConfig);
  }

  static generateToken(userInfo, tokenInfo) {
    const payload = {
      uid: userInfo.uid,
      token: tokenInfo
    };

    return jwt.sign(payload, config.session.jwt.secret, { expiresIn: '1y' });
  }
}

module.exports = JWT;
