const BaseModel = require('./base');
const Event = require('./event')

module.exports = class noise extends BaseModel {
    constructor(ctx) {
      super(ctx, 'noise');
    }
    async markAsNoise(sound){
      console.log("Sound being marked as noise:"+sound);
      await this.collection.insertOne({sound});
      const eventModel = new Event(ctx);
      await eventModel.updateUnvalidatedSounds(sound.event_id, -1);
      return;
    }


}