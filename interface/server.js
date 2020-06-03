const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

let cursor
let sound

MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true})
  .then(client => {
    console.log('Connected to MongoDB!')
    sound = client.db('echoes').collection('sound')

    app.set('view engine', 'pug')

    app.get('/', async (req, res) => {
      const { q } = req.query
      const results = await getResults(q)
      
      console.log(results)
      res.render('dataset', {sounds: results})
    })

    app.listen(5000,() => console.log('listening on port 5000.'))

  })
  .catch(err => console.error(err))

async function getResults (query) {
  return sound.find({$or: [
    {'game_meta.sound_label': query},
    {'meta.category': query}
  ]}).sort({
    'game_meta.sound_label': -1, 
    'meta.category': -1}).toArray()
}