/**
 * sound_categories.js
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

  async addNewCategory(parent, categoryName) {
    if (await this.checkExists(parent, categoryName)) {
      return null;
    }
    let data = {
      parent: parent,
      sub: categoryName,
      sounds: []
    };
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

  // returns true if the given path is in the subcategory designated by categoryName, false otherwise
  async inCategory(categoryName, path) {
    const categoryObj = await this.collection.findOne({sub: categoryName});
    if (categoryObj === null) return false;

    return categoryObj.sounds.includes(path)
  }

  // remove the sound/path from the given category, if it exists in the sounds array
  async removeFromCategory(categoryName, path) {
    const categoryObj = await this.collection.findOne({sub: categoryName});
    if (categoryObj === null) throw "Category doesn't exist";

    if (categoryObj.sounds.includes(path)) {
      try {
        await this.collection.updateOne({
          sub: categoryName
        }, {
          $pull: {sounds: path}
        })
      } catch (err) {
        throw err;
      }
    }
  }

  // add the sound/path to the given category, run in try/catch block to catch errors
  async addToCategory(categoryName, path) {
    const categoryObj = await this.collection.findOne({sub: categoryName});
    if (categoryObj === null) throw "Category doesn't exist";

    if (categoryObj.sounds.includes(path)) {
      throw "Sound already in category"
    } else {
      try {
        await this.collection.updateOne({
          sub: categoryName
        }, {
          $push: {sounds: path}
        })
      } catch (err) {
        throw err;
      }
    }
  }

  async update(id, data) {
    await super.update(id, data);
  }

  async remove(id) {
    await super.remove(id);
  }
};
