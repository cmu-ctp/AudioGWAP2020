/**
 * sounds.js
 * Routes for getting/updating sound validation status
 */

const Router = require('koa-router');
const Sound = require('../../models/sound');
const Noise = require('../../models/noise');
const Joi = require('@hapi/joi');

const userAuth = require('../../lib/session').authRole;

const router = new Router();

router.use(userAuth({ blockRequest: true, roleRequired: 1 }));

const updateSoundSchema = Joi.object({
  category: Joi.string()
}).min(1);


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
  const id = ctx.params.id;
  let soundData = Object.create(ctx.request.body);

  const sound = SoundModel.find(id)

  if (sound === null) {
    ctx.throw(404, 'Sound not found');
  }

  try {
    soundData = await updateSoundSchema.validateAsync(soundData)
  } catch (err) {
    ctx.throw(400, err);
  };

  let updater = {
    meta: soundData
  };

  if (sound.hasOwnProperty('validatedLabel') && sound.validatedLabel !== null) {
    updater.validatedLabel = soundData.category;
  }

  try {
    await SoundModel.update(id, updater);
    ctx.body = {
      'msg': 'Success'
    }
  } catch (err) {
    console.log(err);
    ctx.throw(500, err);
  }
})


module.exports = router;