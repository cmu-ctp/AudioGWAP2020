//dataset.js - Dataset page route module

const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo')
const db = mongo.getDb()
const sound_categories = db.collection('sound_categories')

const categoryList = ["Kitchen", "Bathroom", "Living/Bedroom", "Garage", "Ambience", "Concerning"]

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

router.get('/', async (req, res) => {
  let ontology = {}
  for(const category of categoryList) {
    ontology[category] = await getSubCategories(category)
  }
  //console.log(ontology)
  res.render('dataset', {ontology: ontology})
})

async function getResults(query) {
  let cursor = await sound_categories.find({
    sub: {$regex: query, $options: 'i'}
  })
  return cursor.sort({
    sub: 1
  }).toArray()
}

async function getSubCategories(category) {
  let cursor = await sound_categories.find({'parent': category})
  return cursor.sort({'sub': 1}).toArray()
}

module.exports = router