const BaseModel = require('./base');
const Sound = require('../models/sound');

module.exports = class cachedData extends BaseModel {
    constructor(ctx) {
      super(ctx, 'cache');
    }

    async getUnvalidatedSound(ctx){
        const uid = ctx.user.uid;
        console.log("Fetching data from cache");
        
        // Fetch data if cache is null
        if(await this.collection.countDocuments({}) <= 0) {
            console.log("Restoring cache");
            const soundModel = new Sound(ctx);
            var sounds = await soundModel.fetchSound();
            sounds.forEach(sound => {
                const response =  this.create(sound);
            }); 
        }
       
        // Get search result from cache
        var query = { 
            uid: { $ne: uid},
            'votedLabels.uid': { $ne: uid} 
          };
        const sound = await this.collection.findOne(query);

        return sound;
    }

    async updateCache(sound, uid){
        try {
            console.log("Sound object with label"+sound);
            console.log("Voted Labels: "+sound.votedLabels.toString());
            // Check for majority on reaching max labels
            if(sound.votedLabels.length >= 1){
                const labels = sound.votedLabels;
                let count = 0;
                for(let i=0; i < labels.length; i++){
                    if(labels[i].label === 'Yes'){
                        count++;
                    }
                }

                // If majority votes have been reached, update db & cache
                if(count >= 1){
                    sound.isValidated = true;
                    const soundModel = new Sound(ctx);
                    await soundModel.updateValidatedSound(sound);
                    await this.collection.remove(sound.sid);

                } else {
                    sound.votingRound = sound.votingRound + 1;
                    sound.votedLabels = null;
                    this.collection.update({ sid: sound.sid}, sound);
                }
            }
            else {

                this.sound.votedLabels[votedLabels.length-1].uid = ctx.user.uid;
                this.collection.update({ sid: sound.sid}, sound);
            }
        } catch (err) {
            console.log("Unable to update cache with added labels");
            console.log(err);
        }
        
    }
}