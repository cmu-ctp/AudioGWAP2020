//dataset.js - Dataset page route module

const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo')
const db = mongo.getDb()
const sound = db.collection('sound')

router.get('/', async (req, res) => {
  res.render('dataset')
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
  let cursor
  cursor = await sound.find({$or: [
    {'game_meta.sound_label': {$regex: query, $options: 'i'}},
    {'meta.category': {$regex: query, $options: 'i'}}
  ]})
  return cursor.sort({
    'game_meta.sound_label': -1, 
    'meta.category': -1}).toArray()
}

module.exports = router