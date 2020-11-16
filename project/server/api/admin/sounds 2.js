/**
 * sounds.js
 * Routes for getting/updating sound validation status
 */

const Router = require('koa-router');
const Sound = require('../../models/sound');
const Noise = require('../../models/noise');
const Category = require('../../models/sound_categories');
const Joi = require('@hapi/joi');

const userAuth = require('../../lib/session').authRole;

const router = new Router();

router.use(userAuth({ blockRequest: true, roleRequired: 1 }));

const updateSoundSchema = Joi.object({
  category: Joi.string()
}).min(1);

const updateNoiseSchema = Joi.object({
  category: Joi.string()
})

/**
 * GET /admin/sounds/validated
 * Get list of validated sounds
 */
router.get('/sounds/validated', async (ctx) => {
  let SoundModel = new Sound(ctx);

  try {
    let results = await SoundModel.findQuery({'isValidated': true})
    ctx.body = {
      'msg': 'Success',
      'sounds': results
    }
  } catch (err) {
    console.log(err);
    ctx.throw(500, err);
  }
})

/**
 * GET /admin/sounds/unvalidated
 * Get list of unvalidated sounds
 */
router.get('/sounds/unvalidated', async (ctx) => {
  let SoundModel = new Sound(ctx);

  try {
    let results = await SoundModel.findQuery({ $or: [
      { 'isValidated': false },
      { 'isValidated': { $exists: false }}
    ]})
    ctx.body = {
      'msg': 'Success',
      'sounds': results
    }
  } catch (err) {
    console.log(err);
    ctx.throw(500, err);
  }
})

/**
 * GET /admin/sounds/review
 * Get list of sounds for review (noise)
 */
router.get('/sounds/review', async (ctx) => {
  let NoiseModel = new Noise(ctx);

  try {
    let results = await NoiseModel.findAll()
    ctx.body = {
      'msg': 'Success',
      'sounds': results
    }
  } catch (err) {
    console.log(err);
    ctx.throw(500, err);
  }
})

/**
 * PUT /admin/sounds/:id
 * Reclassify the sound designated by id
 * 
 * Request should be in json form as follows:
 * {
 *    category: 'String, new subcategory name'
 * }
 */
router.put('/sounds/:id', async (ctx) => {
  let SoundModel = new Sound(ctx);
  let CategoryModel = new Category(ctx);
  const id = ctx.params.id;
  let soundData = Object.create(ctx.request.body);

  const sound = await SoundModel.find(id)

  if (sound === null) {
    ctx.throw(404, 'Sound not found');
  }

  try {
    soundData = await updateSoundSchema.validateAsync(soundData)
  } catch (err) {
    ctx.throw(400, err);
  };

  // if already in the category don't bother
  if (await CategoryModel.inCategory(soundData.category, sound.path)) {
    ctx.throw(400, "Sound already in specified category");
  }
  

  let updater = {};

  if (sound.isValidated) { // if validated, update validatedLabel only, remove from current category
    updater.validatedLabel = soundData.category;
    try {
      await CategoryModel.removeFromCategory(sound.validatedLabel, sound.path);
    } catch (err) {
      console.log(err);
      ctx.throw(400, err); // since either means bad category or bad sound path
    }
  } else {
    // else, update meta.category, reset validation voting
    updater.meta = soundData;
    updater.votedLabels = [];
    updater.votingRound = 0; // Should change because we reset voting
  }
  
  // update sound doc and add to the new category
  try {
    await CategoryModel.addToCategory(soundData.category, sound.path);
    await SoundModel.update(id, updater);
    ctx.body = {
      'msg': 'Success'
    }
  } catch (err) {
    console.log(err);
    // if it failed on update
    if (await CategoryModel.inCategory(sound.validatedLabel, sound.path)) {
      await CategoryModel.removeFromCategory(sound.validatedLabel, sound.path);
    }
    ctx.throw(500, err);
  }
})

/**
 * PUT /admin/sounds/review/:id
 * Reclassify the sound designated by id, and add it to validated sounds.
 * This route is specifically for audios being reviewed (aka in the noise collection)
 * 
 * Request should be in json form as follows:
 * {
 *    category: 'String, new subcategory name'
 * }
 * 
 * If the request doesn't have the category field, it will assume to just use its predefined label
 */
router.put('/sounds/review/:id', async (ctx) => {
  let NoiseModel = new Noise(ctx);
  let SoundModel = new Sound(ctx);
  let CategoryModel = new Category(ctx);
  const id = ctx.params.id;
  let soundData = Object.create(ctx.request.body);

  const noise = await NoiseModel.find(id)

  if (noise === null) {
    ctx.throw(404, 'Sound not found');
  }

  try {
    soundData = await updateNoiseSchema.validateAsync(soundData)
  } catch (err) {
    ctx.throw(400, err);
  };

  let updater = noise.sound;
  updater.isValidated = true;
  // if category is given use that, otherwise just use category given at upload
  updater.validatedLabel = soundData.category || updater.meta.category;

  try {
    await CategoryModel.addToCategory(updater.validatedLabel, updater.path);
    const idObj = await SoundModel.create(updater);
    await NoiseModel.remove(id);
    ctx.body = {
      'msg': 'Success',
      'id': idObj.id
    }
  } catch (err) {
    console.log(err);
    // if it failed on create or remove
    if (await CategoryModel.inCategory(sound.validatedLabel, sound.path)) {
      await CategoryModel.removeFromCategory(sound.validatedLabel, sound.path);
    }
    ctx.throw(500, err);
  }
})


module.exports = router;