const express = require('express')
const app = express()
const mongo = require('./lib/mongo')
require('dotenv').config()

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use('/upload', express.static('../project/server/upload'))

mongo.dbConnect(err => {
  const datasetRouter = require('./routes/dataset')
  app.use('/dataset', datasetRouter)

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

  /*app.get('/dataset', async (req, res) => {
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
  })*/

  app.get('/people', async (req, res) => {
    res.render('people')
  })

  app.get('/future', async (req, res) => {
    res.render('future')
  })
  
  app.get('/', async (req, res) => {
    res.render('home')
  })

  app.listen(5000,() => console.log('listening on port 5000.'))
})