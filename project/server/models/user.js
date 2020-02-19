/**
 * user.js
 * User model.
 */

const BaseModel = require('./base');

module.exports = class User extends BaseModel {
  constructor(ctx) {
    super(ctx, 'users');
  }

  async find(id) {
    const result = await super.find(id);
    return this.filterResult(result);
  }

  async findByUid(uid) {
    const result = await this.collection.findOne({
      uid: uid
    });

    return this.filterResult(result) || null;
  }

  async findAll() {
    const result = await super.findAll();
    return this.filterResult(result);
  }

  async findQuery(query) {
    const result = await super.findQuery(query);
    return this.filterResult(result);
  }

  async registerOrUpdate(data) {
    if (!data || !data.uid) return;

    const existingUser = await this.collection.findOne({
      uid: data.uid
    });

    // Register if not exists
    if (!existingUser) {
      const id = await this.create(data);
      //console.log(id);
      return;
    }

    await this.collection.updateOne({
      uid: data.uid
    }, {
      $set: data
    });
  }

  async updateInfo(uid, data) {
    if (!data) {
      throw new Error('invalid update data');
    }

    await this.collection.updateOne({
      'uid': uid
    }, {
      $set: data
    });
  }

  filterResult(user) {
    if (user == null)
      return user;

    if (Array.isArray(user)) {
      user = user.map((e) => this.filterResult(e));
      return user;
    }

    if (user._id) {
      delete user._id;
    }

    if (!Object.prototype.hasOwnProperty.call(user, 'game_meta')) {
      user.game_meta = {};
    }

    return user;
  }
};
