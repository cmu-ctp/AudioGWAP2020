/**
 * index.js
 * Config collector.
 */

module.exports = {
  mongo: require('./mongo.js'),
  oauth: require('./oauth.js'),
  session: require('./session.js'),
  upload: require('./upload.js')
};
