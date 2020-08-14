//home.js - Home page route module

const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo')
const db = mongo.getDb()
const sound_categories = db.collection('sound_categories')

// categories are hardcoded as of now, change in future to get from database
const categoryList = ["Kitchen", "Bathroom", "Living/Bedroom", "Garage", "Ambience", "Concerning"]

/**
 * Gets stats for visualizations on the homepage.
 * 
 * ontology: Object, contains one key for each parent category, whose value is an array of all its subcategories
 * following the sound_categories database schema.
 * ex: {
 *  Kitchen: [
 *    {
 *      _id: ObjectId (objectid of subcategory in sound_categories database)
 *      parent: 'Kitchen',
 *      sub: 'Cooking',
 *      sounds: [ '/path/to/file1.wav', '/path/to/file2.wav', ... ]
 *    },
 *    ...
 *  ],
 *  ...
 * }
 * numCategories: Number, amount of categories in the database
 * numAudios: Number, amount of sounds attached to any category (if its in the doc of a category, is considered validated)
 * 
 * TODO: Add logic to get # of downloads, should eventually get categories from database
 */
router.get('/', async (req, res) => {
  let ontology = {};
  let numCategories = 0;
  let numAudios = 0;

  // this should eventually be changed to get the list of categories from the database
  for (const category of categoryList) {
    ontology[category] = await getSubCategories(category);
    numCategories += ontology[category].length;
    for (const subCategory of ontology[category]) {
      numAudios += subCategory.sounds.length;
    }
  }
  
  console.log(ontology);
  res.render('home', {
    ontology: ontology,
    numCategories: numCategories,
    numAudios: numAudios
  });
})

//Searches sound_categories database for subcategories with a desired parent category
async function getSubCategories(category) {
  let cursor = await sound_categories.find({'parent': category})
  return cursor.sort({'sub': 1}).toArray()
}

module.exports = router