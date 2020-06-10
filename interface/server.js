const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

let sound
const user = encodeURIComponent(process.env.MONGO_USER)
const pass = encodeURIComponent(process.env.MONGO_PASS)
const mongoURL = `mongodb://${user}:${pass}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}?authSource=${process.env.MONGO_AUTH_SOURCE}`

MongoClient.connect(mongoURL, {useUnifiedTopology: true})
  .then(client => {
    console.log('Connected to MongoDB!')
    sound = client.db(process.env.MONGO_DB).collection('sound')

    app.set('view engine', 'pug')

    app.use('/upload', express.static('../project/server/upload'))

    app.get('/', async (req, res) => {
      const { q } = req.query
      const results = await getResults(q)
      
      if(q) {
        console.log('Query: ' + q)
      }
      res.render('dataset', {sounds: results, query: q})
    })

    app.listen(5000,() => console.log('listening on port 5000.'))

  })
  .catch(err => console.error(err))

async function getResults (query) {
  let cursor
  if (query && query.length > 0) {
    cursor = await sound.find({$or: [
      {'game_meta.sound_label': {$regex: query, $options: 'i'}},
      {'meta.category': {$regex: query, $options: 'i'}}
    ]})
  } else {
    cursor = await sound.find()
  }
  return cursor.sort({
    'game_meta.sound_label': -1, 
    'meta.category': -1}).toArray()
}