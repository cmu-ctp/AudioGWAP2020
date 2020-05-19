/**
 * twitch.js
 * Twitch API gateway.
 */

const querystring = require('querystring');
const axios = require('axios');

const config = require('../config');

const ErrorUtil = require('../util/error');

/**
 * Twitch API Client.
 */
class Twitch {
  constructor(tokens) {
    this.tokens = tokens || {};

    // General purpose client
    this.client = axios.default;

    // New Twitch API
    this.twitchClient = this.client.create({
      baseURL: 'https://api.twitch.tv/helix/',
      headers: { 'Authorization': `Bearer ${this.tokens.access_token || ''}`,
                 'Client-ID': config.oauth.twitch.key 
    }
    });
  }

  /**
   * Validate if the current session is valid.
   * An error will be thrown if the validation fails.
   */
  async validate() {
    try {
      await this.client.get(
        'https://id.twitch.tv/oauth2/validate',
        { headers: { 'Authorization': `OAuth ${this.tokens.access_token || ''}` } });
    } catch (error) {
      //console.log(error.toString());
      throw ErrorUtil.unauthorized();
    }
  }

  /**
   * Revoke access and refresh tokens before log out.
   */
  async revokeTokens() {
    // Revoke access token
    try {
      await this.client.post(
        'https://id.twitch.tv/oauth2/revoke',
        querystring.stringify({
          client_id: config.oauth.twitch.key,
          token: this.tokens.access_token
        }));
    } catch (error) {
      console.log(error.toString());
      // pass through
    }

    // Revoke refresh token
    try {
      await this.client.post(
        'https://id.twitch.tv/oauth2/revoke',
        querystring.stringify({
          client_id: config.oauth.twitch.key,
          token: this.tokens.refresh_token
        }));
    } catch (error) {
      console.log(error.toString());
      // pass through
    }
  }

  /**
   * Get the current user info.
   */
  async getUserInfo() {
    await this.validate();
    const { data } = await this.twitchClient.get('/users');
    //console.log(data);

    return data.data[0] || null;
  }
}

module.exports = Twitch;
