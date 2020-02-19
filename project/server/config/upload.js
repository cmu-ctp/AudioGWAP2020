/**
 * upload.js
 * Upload configuration.
 */

 const path = require('path');

module.exports = {
  dir: path.resolve(__dirname + '/../upload/') + path.sep,
  urlPrefix: '/upload/'
};
