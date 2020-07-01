//dataset.js - Dataset page route module

const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo')
const db = mongo.getDb()
const sound_categories = db.collection('sound_categories')

const categoryList = ["Kitchen", "Bathroom", "Living/Bedroom", "Garage", "Ambience", "Concerning"]

/** Route for search results
 *  Searches database from the query operators in URL
 */
router.get('/search/', async (req, res) => {
  const { q } = req.query
  let results = []
  if (q && q.length > 0) {
      results = await getResults(q)
  }
  if (q) {
      console.log('Query: ' + q)
  }

  let numFound = 0
  for (category of results) {
    numFound += category.sounds.length
  }

  res.render('search', {results: results, query: q, count: numFound})
})

/** Route for general dataset landing page
 *  Populates list of categories via hardcoded array (for now), searches
 *  db to get list of subcategories for each parent category
 */
router.get('/', async (req, res) => {
  let ontology = {}
  for(const category of categoryList) {
    ontology[category] = await getSubCategories(category)
  }
  //console.log(ontology)
  res.render('dataset', {ontology: ontology})
})

//Searches sound_categories database for categories that match
async function getResults(query) {
  let cursor = await sound_categories.find({
    sub: {$regex: query, $options: 'i'}
  })
  return cursor.sort({
    sub: 1
  }).toArray()
}

//Searches sound_categories database for subcategories with a desired parent category
async function getSubCategories(category) {
  let cursor = await sound_categories.find({'parent': category})
  return cursor.sort({'sub': 1}).toArray()
}

module.exports = router