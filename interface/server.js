const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

let sound
let mongoURL = 'mongodb://'
if (process.env.MONGO_USER && process.env.MONGO_PASS) {
  const user = encodeURIComponent(process.env.MONGO_USER)
  const pass = encodeURIComponent(process.env.MONGO_PASS)
  mongoURL += `${user}:${pass}@`
}
mongoURL += `${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
if (process.env.MONGO_AUTH_SOURCE) {
  mongoURL += `?authSource=${process.env.MONGO_AUTH_SOURCE}`
}


MongoClient.connect(mongoURL, {useUnifiedTopology: true})
  .then(client => {
    console.log('Connected to MongoDB!')
    sound = client.db(process.env.MONGO_DB).collection('sound')

    app.set('view engine', 'pug')
    app.use(express.static('public'));

    app.use('/upload', express.static('../project/server/upload'))

    app.get('/d/upload/:path1/:path2/:fileName', (req, res) => {
      if(!req.params.fileName.endsWith('.wav')){
        console.error('Not a .wav file')
        res.status(404).send("Sorry, we can't find that file.")
      } else {
        var filePath = `../project/server/upload/${req.params.path1}/${req.params.path2}/${req.params.fileName}`
        res.download(filePath, req.params.fileName)
        console.log('File ' + req.params.fileName + ' Downloaded!')
      }
    })

    app.get('/dataset', async (req, res) => {

      res.render('dataset')
    })
      app.get('/dataset/results', async (req, res) => {
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


    app.get('/', async (req, res) => {
        res.render('home')
    })
      app.get('/people', async (req, res) => {
          res.render('people')
      })
      app.get('/future', async (req, res) => {
          res.render('future')
      })

    app.listen(5000,() => console.log('listening on port 5000.'))

  })
  .catch(err => console.error(err))

async function getResults (query) {
  let cursor
  cursor = await sound.find({$or: [
    {'game_meta.sound_label': {$regex: query, $options: 'i'}},
    {'meta.category': {$regex: query, $options: 'i'}}
  ]})
  return cursor.sort({
    'game_meta.sound_label': -1, 
    'meta.category': -1}).toArray()
}