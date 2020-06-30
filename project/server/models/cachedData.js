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
        const soundsNotPresentInCache = await this.collection.countDocuments({}) <= 0;
        if(soundsNotPresentInCache) {
            console.log("Restoring cache");
            const soundModel = new Sound(ctx);
            var sounds = await soundModel.fetchSound();
            // for (let soundItem in sounds) {
            //     console.log(soundItem);
            //     await this.collection.insertOne(soundItem);
            // }
            await Promise.all(sounds.forEach(async (sound) => {
                const response =  await this.create(sound);
            }));
        }
       
        // Get search result from cache
        var query = { 
            uid: { $ne: uid},
            'votedLabels.uid': { $ne: uid} 
          };
        const sound = await this.collection.findOne(query);

        return sound;
    }

    async updateCache(ctx){
        try {
            const uid = ctx.user.uid;
            const sound = JSON.parse(ctx.request.body.sound);
            if(!sound) {
                ctx.throw(400, "Post object cannot be null")
              }
            console.log("Initially received sound object with label"+JSON.stringify(sound));
            
            // Check for majority on reaching max labels
            if(sound.votedLabels.length >= 3){
                const labels = sound.votedLabels;
                let count = 0;
                for(let i=0; i < labels.length; i++){
                    if(labels[i].label === 'Yes'){
                        count++;
                    }
                }

                // If majority votes have been reached, update db & cache
                if(count >= 2){
                    console.log("Majority votes have been achieved");
                    sound.isValidated = true;
                    sound.validatedLabel = sound.meta.category;
                    const soundModel = new Sound(ctx);
                    await soundModel.updateValidatedSound(sound);
                    await this.collection.remove({'sid': sound.sid});

                } else {
                    sound.votingRound = sound.votingRound + 1;
                    sound.votedLabels = null;
                    //this.collection.update({ sid: sound.sid}, sound);
                    await this.collection.updateOne({ sid: sound.sid}, 
                        {
                          $set: {
                            votingRound: sound.votingRound + 1,
                            votedLabels: null
                          }
                        });
                }
            }
            else {
                const labels = sound.votedLabels
                labels[(labels.length)-1].uid = ctx.user.uid;
                console.log("Final updated sound object being resaved in cache:" + JSON.stringify(sound));
                await this.collection.updateOne({ sid: sound.sid},
                    {
                        $set: {
                            votedLabels: sound.votedLabels
                        }

                    });
            }
        } catch (err) {
            console.log("Error occured while processing post object with label");
            console.log(err);
        }
        
    }
}