/**
 * sound.js
 * Sound model.
 */

const BaseModel = require('./base');
const Event = require('./event');
const User = require('./user');
const fs = require('fs');
const path = require('path');

module.exports = class Sound extends BaseModel {
  constructor(ctx) {
    super(ctx, 'sound');
    this.includeUnpublishedEvents = true;
  }

  async deleteUserSound(uid){
    var query = { uid: uid };
    const userSounds = await this.collection.find(query).toArray();

    for(let usersound of userSounds){
      const soundPath = path.resolve(__dirname + '/..' + usersound.path);
      try {
        fs.unlinkSync(soundPath);
        console.log("All .wav files successfully removed from server");
      } catch(err) {
        console.log("Unable to delete .wav file");
        console.error(err);
      }
    }
    try{
      await this.collection.deleteMany(query);
      console.log("All file removed from DB");
    } catch(err) {
      console.log("Unable to delete sound from DB");
      console.log(err);
    }

    
  }

  async fetchSound(uid){
    var query = { 
      isValidated: { $eq: false },
      uid: { $ne: uid},
      'votedLabels.uid': { $ne: uid} 
    };
    const sound = await this.collection.findOne(query);
    
    //let sound = await this.collection.find({ uid: uid }).toArray();
    console.log(uid);
    console.log(sound);
    return sound;
  }
  
  async find(id) {
    let result = await this.collection.findOne(this.filterQuery({
      _id: this.getObjectId(id)
    }));

    return this.filterResult(result) || null;
  }

  async findAll() {
    const resultList = await this.collection.find(this.filterQuery({})).sort({'_id': -1}).toArray();
    return this.filterResult(resultList);
  }

  async findQuery(query) {
    const resultList = await this.collection.find(this.filterQuery(query)).sort({'_id': -1}).toArray();
    return this.filterResult(resultList);
  }

  async findQueryWithEvent(query) {
    const eventModel = new Event(this.ctx);
    eventModel.includeUnpublishedEvents = this.includeUnpublishedEvents;

    // Filter events and append object key prefix
    const eventQuery = eventModel.filterQuery({});
    const eventSubQuery = Object.keys(eventQuery).reduce((newQuery, key) => {
      newQuery[`event.${key}`] = eventQuery[key];
      return newQuery;
    }, {});

    let resultList = await this.collection.aggregate([
      { $match: this.filterQuery(query) },
      {
        // Left Outer Join
        $lookup: {
          localField: 'event_id',
          from: 'events',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      { $match: eventSubQuery },
      { $sort: { '_id': -1 } }
    ]).toArray();

    resultList = this.filterResult(resultList);
    // Remove redundant event info
    resultList = Array.prototype.map.call(resultList, (item) => {
      if (item.event) {
        item.event = eventModel.filterResult(item.event, true);
      }
      return item;
    });

    return resultList;
  }

  async findQueryWithUser(query) {
    const userModel = new User(this.ctx);

    let resultList = await this.collection.aggregate([
      { $match: this.filterQuery(query) },
      {
        // Left Outer Join
        $lookup: {
          localField: 'uid',
          from: 'users',
          foreignField: 'uid',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $sort: { '_id': -1 } }
    ]).toArray();

    resultList = this.filterResult(resultList);
    // Remove redundant user info
    resultList = Array.prototype.map.call(resultList, (item) => {
      if (item.user) {
        item.user = userModel.filterResult(item.user);
      }
      return item;
    });

    return resultList;
  }

  async getUserStat(query) {
    const result = await this.collection.aggregate([
      // Group and Count
      { $match: this.filterQuery(query) },
      { $group: { _id: '$uid', sound_count: { $sum: 1 } } },
      { $addFields: { 'uid': '$_id' }},
      // Join user
      {
        $lookup: {
          localField: 'uid',
          from: 'users',
          foreignField: 'uid',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      // Sort
      { $sort: { 'sound_count': -1 } }
    ]).toArray();

    // Remove unnecessary fields
    result.forEach(stat => {
      if (Object.hasOwnProperty.call(stat, '_id')) {
        delete stat._id;
      }
      if (Object.hasOwnProperty.call(stat, 'game_meta')) {
        delete stat.game_meta;
      }
      return stat;
    });

    return result;
  }

  async getCategoryStat(query) {
    const result = await this.collection.aggregate([
      // Group and Count
      { $match: this.filterQuery(query) },
      { $group: { _id: '$meta.category', sound_count: { $sum: 1 } } },
      { $addFields: { 'category': '$_id' }},
      // Sort
      { $sort: { 'sound_count': -1 } }
    ]).toArray();

    // Remove unnecessary fields
    result.forEach(stat => {
      if (Object.hasOwnProperty.call(stat, '_id')) {
        delete stat._id;
      }
      return stat;
    });

    return result;
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

  async forceRemove(id) {
    await this.collection.removeOne({
      _id: this.getObjectId(id)
    });
  }

  hideUnpublishedEvents() {
    this.includeUnpublishedEvents = false;
  }

  showUnpublishedEvents() {
    this.includeUnpublishedEvents = true;
  }

  filterQuery(query) {
    return Object.assign(query || {}, {
      'is_deleted': {$in: [null, false]}
    });
  }

  filterResult(sound) {
    if (sound == null)
      return sound;

    if (Array.isArray(sound)) {
      sound = sound.map((e) => this.filterResult(e));
      return sound;
    }

    if (!sound.id) {
      sound.id = sound._id;
    }

    // FIXME: Remove this unused field in the future
    // We will keep this field for compatibility with old data (with model attached to sound directly)

    // Remove model in game_meta cause we no longer need it
    // if (sound.game_meta && sound.game_meta.model) {
    //   delete sound.game_meta.model;
    // }

    // Override sound model settings if user model exists
    if (sound.user && sound.user.game_meta && sound.user.game_meta.model) {
      if (!sound.game_meta) {
        sound.game_meta = {};
      }
      sound.game_meta.model = sound.user.game_meta.model;
    }

    if (Object.prototype.hasOwnProperty.call(sound, 'is_deleted')) {
      delete sound.is_deleted;
    }

    return sound;
  }
};
