/**
 * event.js
 * Event model.
 */

const shortid = require('shortid');

const BaseModel = require('./base');
const User = require('./user');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

module.exports = class Event extends BaseModel {
  constructor(ctx) {
    super(ctx, 'events');
    this.includeUnpublishedEvents = true;
  }

  async find(id) {
    let result = await this.collection.findOne(this.filterQuery({
      _id: this.getObjectId(id)
    }));

    return this.filterResult(result) || null;
  }

  async findWithCreator(id) {
    const userModel = new User(this.ctx);

    let result = await this.collection.findOne(this.filterQuery({
      _id: this.getObjectId(id)
    }));

    if (result) {
      result.creator = await userModel.findByUid(result.uid);
    }

    return this.filterResult(result) || null;
  }

  async findByToken(token) {
    const result = await this.collection.findOne(this.filterQuery({
      game_token: token
    }));

    return this.filterResult(result) || null;
  }

  async findWithToken(id) {
    const result = await this.collection.findOne(this.filterQuery({
      _id: this.getObjectId(id)
    }));

    return result || null;
  }

  async findAll() {
    const resultList = await this.collection
      .find(this.filterQuery({}))
      .sort({'time': -1})
      .toArray();
    return this.filterResult(resultList, true);
  }
  
  async findAllWithCreator() {
    const resultList = await this.collection.aggregate([
      { $match: this.filterQuery({}) },
      {
        // Left Outer Join
        $lookup: {
          localField: 'uid',
          from: 'users',
          foreignField: 'uid',
          as: 'creator'
        }
      },
      { $unwind: '$creator' },
      { $sort: { 'time': -1 } }
    ]).toArray();

    return this.filterResult(resultList, true);
  }

  async findQuery(query) {
    const resultList = await this.collection
      .find(this.filterQuery(query))
      .sort({'time': -1})
      .toArray();
    return this.filterResult(resultList, true);
  }

  async findQueryWithCreator(query) {
    const resultList = await this.collection.aggregate([
      { $match: this.filterQuery(query) },
      {
        // Left Outer Join
        $lookup: {
          localField: 'uid',
          from: 'users',
          foreignField: 'uid',
          as: 'creator'
        }
      },
      { $unwind: '$creator' },
      { $sort: { 'time': -1 } }
    ]).toArray();

    return this.filterResult(resultList, true);
  }

  async getToken(id) {
    const result = await this.collection.findOne(this.filterQuery({
      _id: this.getObjectId(id)
    }));

    if (!result) {
      return null;
    }

    return result.game_token || null;
  }

  async create(data) {
    if (!data) {
      throw new Error('invalid create data');
    }

    // Set game token
    data.game_token = shortid.generate();
    //console.log(data);

    return await super.create(data);
  }

  async userInEvent(id, uid) {
    const result = await this.collection.findOne({
      '_id': super.getObjectId(id),
      'joined_users': [uid]
    });
    return result ? true : false;
  }

  async join(id, uid) {
    await this.collection.updateOne(this.filterQuery({
      '_id': super.getObjectId(id),
    }), {
      $addToSet: {
        'joined_users': [uid]
      }
    });
  }

  async exit(id, uid) {
    await this.collection.updateOne(this.filterQuery({
      '_id': super.getObjectId(id),
    }), {
      $pull: {
        'joined_users': [uid]
      }
    });
  }

  async remove(id) {
    await this.collection.updateOne({
      _id: this.getObjectId(id)
    }, {
      $set: {
        is_deleted: true
      }
    });
  }

  async removeAll() {
    await this.collection.updateMany(this.filterQuery({}), {
      $set: {
        is_deleted: true
      }
    });
  }

  async forceRemove(id) {
    await this.collection.deleteOne({
      _id: this.getObjectId(id)
    });
  }

  async updateUnvalidatedSounds(id, count){
    try{
      await this.collection.updateOne({ _id: id},
        {
          $inc: {unvalidatedSounds : count}
        })
    } catch(err){
      console.log("Unable to update the count of unvalidated sounds for event id "+ id);
      console.log(err);
    }
  }

  async findEventWithMinValidatedSound(){
    try{
      const eventArray = await this.collection.find().sort({ unvalidatedSound: -1}).toArray();
      return eventArray;
    } catch (err){
      console.log("Unable to query sound collection to find event with max unvalidated sounds");
      console.log(err);
    }
    
  }

  async forceRemoveAll() {
    await this.collection.deleteMany();
  }

  hideUnpublishedEvents() {
    this.includeUnpublishedEvents = false;
  }

  showUnpublishedEvents() {
    this.includeUnpublishedEvents = true;
  }

  filterQuery(query) {
    let queryOverride = {
      'is_deleted': {$in: [null, false]}
    };

    if (!this.includeUnpublishedEvents) {
      queryOverride['is_published'] = true;
    }

    return Object.assign(query || {}, queryOverride);
  }

  filterResult(event, isBrief) {
    isBrief = isBrief || false;

    if (event == null)
      return event;

    if (Array.isArray(event)) {
      event = event.map((e) => this.filterResult(e, isBrief));
      return event;
    }

    if (!event.id) {
      event.id = event._id;
    }

    if (event.gameToken) {
      delete event.gameToken;
    }

    if (event.game_token) {
      delete event.game_token;
    }

    if (event.joined_users) {
      delete event.joined_users;
    }

    if (event.creator) {
      delete event.creator._id;
      delete event.creator.user_name;
    }

    if (isBrief) {
      if (event.categories) {
        delete event.categories;
      }
    }

    if (Object.prototype.hasOwnProperty.call(event, 'is_deleted')) {
      delete event.is_deleted;
    }

    return event;
  }
};
