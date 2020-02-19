/**
 * sound_category.js
 * Sound category model.
 */

const BaseModel = require('./base');

module.exports = class SoundCategory extends BaseModel {
  constructor(ctx) {
    super(ctx, 'sound_categories');
  }
};
