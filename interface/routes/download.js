//download.js - Download route module

const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo')
const db = mongo.getDb()
const bodyParser = require('body-parser')
const sound_categories = db.collection('sound_categories')

router.get('/upload/:path1/:path2/:fileName', (req, res) => {
  if(!req.params.fileName.endsWith('.wav')){
    console.error('Not a .wav file')
    res.status(404).send("Sorry, we can't find that file.")
  } else {
    var filePath = `../project/server/upload/${req.params.path1}/${req.params.path2}/${req.params.fileName}`
    res.download(filePath, req.params.fileName)
    console.log('File ' + req.params.fileName + ' Downloaded!')
  }
})

const urlParser = bodyParser.urlencoded({ extended: true })

router.post('/', urlParser, async (req, res) => {
  const download = req.body.d
  if (download == null) {
    console.error('Bad request')
    res.status(404).send("Sorry, we couldn't find the categories you wanted")
  } else {
    let catQuery = [];
    for (const category of download) {
      let obj = { sub: category}
      catQuery.push(obj)
    }
    
    let results = await getResults(catQuery)
    res.send(results)
  }
})

async function getResults(queryArray) {
  let cursor = await sound_categories.find({
    $or: queryArray
  })

  return cursor.project({_id: 0, sub: 1, sounds: 1}).toArray()
}

module.exports = router