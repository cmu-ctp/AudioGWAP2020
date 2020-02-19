/**
 * _util.js
 * Authentication utilities..
 */

module.exports = {
  extractUserInfo(userInfo) {
    if (!userInfo)
      return null;

    return {
      uid: userInfo.id,
      user_name: userInfo.login,
      display_name: userInfo.display_name,
      avatar_url: userInfo.profile_image_url,
      game_meta: {}
    };
  }
};
