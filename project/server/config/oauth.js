/**
 * oauth.js
 * OAuth configuration.
 */

module.exports = {
  defaults: {
    protocol: process.env.APP_PROTOCOL || 'http',
    host: (process.env.APP_HOST || 'localhost'),
    path: '/api'
  },
  twitch: {
    key: process.env.TWITCH_APP_KEY || '',
    secret: process.env.TWITCH_APP_SECRET || '',
    overrides: {
      web: {
        scope: [
          //'user:read:email'
        ],
        callback: '/api/auth/twitch/web'
      },
      token: {
        scope: [],
        callback: '/api/auth/twitch/token'
      },
      admin: {
        scope: [],
        callback: '/api/auth/twitch/admin'
      }
    },
    custom_params: {
      force_verify: true
    }
  },
  error: {
    some: 'Authorization failed. Please try again.'
  }
};
