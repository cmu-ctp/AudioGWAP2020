//dataset.js - Dataset page route module

const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo')
const db = mongo.getDb()
const sound = db.collection('sound')
const sound_categories = db.collection('sound_categories')

const categoryList = ["Kitchen", "Bathroom", "Living/Bedroom", "Garage", "Ambience", "Concerning"]

router.get('/', async (req, res) => {
  let ontology = {}
  for(const category of categoryList) {
    ontology[category] = await getSubCategories(category)
  }
  console.log(ontology)
  res.render('dataset', {ontology: ontology})
})

router.get('/results', async (req, res) => {
  const { q } = req.query
  let results = []
  if (q && q.length > 0) {
      results = await getResults(q)
  }
  if (q) {
      console.log('Query: ' + q)
  }
  res.render('results', {sounds: results, query: q})
})

async function getResults(query) {
  let cursor = await sound.find({$or: [
    {'game_meta.sound_label': {$regex: query, $options: 'i'}},
    {'meta.category': {$regex: query, $options: 'i'}}
  ]})
  return cursor.sort({
    'game_meta.sound_label': -1, 
    'meta.category': -1}).toArray()
}

async function getSubCategories(category) {
  let cursor = await sound_categories.find({'parent': category})
  return cursor.sort({'sub': 1}).toArray()
}

module.exports = router