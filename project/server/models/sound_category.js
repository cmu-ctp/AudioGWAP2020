/**
 * sound_category.js
 * Sound category model.
 */

const BaseModel = require('./base');

module.exports = class SoundCategory extends BaseModel {
  constructor(ctx) {
    super(ctx, 'sound_categories');
  }

  async find(id) {
    return await super.find(id);
  }

  async findAll() {
    return await super.findAll();
  }

  async findByParent(parent) {
    return await super.findQuery({ parent: parent });
  }

  //returns true if a given category already exists.
  async checkExists(parent, categoryName) {
    let query = {
      parent: parent,
      sub: categoryName
    };
    let results = await super.findQuery(query);
    return results.length > 0;
  }

  async addCategory(parent, categoryName) {
    if (await this.checkExists(parent, categoryName)) {
      return null;
    }
    let data = {
      parent: parent,
      sub: categoryName,
      sounds: []
    }
    return await super.create(data);
  }

  async getAllCategories() {
    const allSubCategories = await this.findAll();
    let categoriesObj = {};
    allSubCategories.forEach(category => {
      let parent = category.parent;

      if (!categoriesObj.hasOwnProperty(parent)) {
        categoriesObj[parent] = [];
      }
      categoriesObj[parent].push(category);

    });
    return categoriesObj;
  }

  convertCase(s) {
    if (typeof s !== 'string') {
      return '';
    }
    let uc = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    let slash = uc.indexOf('/');
    if (slash !== -1) {
      slash += 1;
      uc = uc.slice(0, slash) + uc.charAt(slash).toUpperCase() + uc.slice(slash + 1);
    }
    return uc;
  }

  async update(id, data) {
    await super.update(id, data);
  }

  async remove(id) {
    await super.remove(id);
  }
};
