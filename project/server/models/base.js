/**
 * base.js
 * Base class for models.
 */

const mongo = require('../lib/koa-mongo');

const ErrorUtil = require('../util/error');

module.exports = class BaseModel {
  constructor(ctx, collectionName) {
    this.ctx = ctx;
    this.db = ctx.db;
    this.collection = this.db.collection(collectionName);
  }

  async find(id) {
    const result = await this.collection.findOne({
      _id: this.getObjectId(id)
    });

    return result || null;
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async findQuery(query) {
    return await this.collection.find(query).toArray();
  }

  async create(data) {
    if (!data) {
      throw new Error('invalid create data');
    }

    const result = await this.collection.insertOne(data);
    const id = result.ops[0]._id.toString();

    return {
      id: id 
    };
  }

  async update(id, data) {
    if (!data) {
      throw new Error('invalid update data');
    }

    await this.collection.updateOne({
      _id: this.getObjectId(id)
    }, {
      $set: data
    });
  }

  async remove(id) {
    await this.collection.deleteOne({
      _id: this.getObjectId(id)
    });
  }

  async removeAll() {
    await this.collection.deleteMany();
  }

  getObjectId(id) {
    try {
      return mongo.ObjectId(id);
    } catch (e) {
      //console.log(e);

      // Convert it as a user-friendly message
      throw ErrorUtil.create(400, 'Invalid id', {
        id: id
      });
    }
  }

  createObjectId() {
    return new mongo.ObjectId();
  }
};
