const BaseModel = require('./base');

module.exports = class noise extends BaseModel {
    constructor(ctx) {
      super(ctx, 'noise');
    }
    async markAsNoise(sound){
      console.log("Sound being marked as noise:"+sound);
      await this.collection.insertOne({sound});
      return;
    }


}