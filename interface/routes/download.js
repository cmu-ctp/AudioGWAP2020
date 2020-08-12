//download.js - Download route module

const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo')
const db = mongo.getDb()
const bodyParser = require('body-parser')
const sound_categories = db.collection('sound_categories')
const fs = require('fs')
const jszip = require('jszip')
const JSZip = require('jszip')

/** Individual file download route
 *  URL path of a file's download link is their location within project/server/upload
 */
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

/** Bulk sound download route
 *  Determines which sounds to download via URLencoded POST data
 *  The body object has one array per sound category, and each sound's path is within its category's array
 */
router.post('/sounds', urlParser, async (req, res) => {
  const download = req.body;
  // console.log(download);
  if (download == null) {
    console.error('Bad request')
    res.status(404).send("Sorry, we couldn't find the sounds you wanted")
  } else {
    let zip = JSZip();
    for (const parent in download) {
      const paths = download[parent];
      if (!Array.isArray(paths) || paths.length === 0) {
        continue;
      }
      let count = 0;
      //get number of digits for padding reasons
      let maxDigits = paths.length.toString().length;
      const localeOptions = {
        useGrouping: false,
        minimumIntegerDigits: maxDigits
      }

      // some category names have slashes which doesnt play well with JSZip
      const parentSanitized = parent.replace("/","-");
      for (const path of paths) {
        if (!path.endsWith('.wav')) {
          continue;
        }
        count++;
        let filename = parentSanitized + count.toLocaleString('en-US', localeOptions) + '.wav';
        let filePath = '../project/server' + path;
        zip.file(filename, fs.readFileSync(filePath));
      }
    }

    res.set('Content-Type', 'application/zip')
    res.set('Content-Disposition', 'attachment; filename=sounds.zip')
    zip.generateNodeStream({type: 'nodebuffer', streamFiles: true})
    .pipe(res)
    console.log("Zip file generated and downloaded!")
  }
  
})

/** Category download route
 *  Determines which category to download via URLencoded POST data
 */
router.post('/', urlParser, async (req, res) => {
  const download = req.body.d //array of categories to be downloaded
  if (download == null) {
    console.error('Bad request')
    res.status(404).send("Sorry, we couldn't find the categories you wanted")
  } else {
    //build array for mongoDB query
    let catQuery = [];
    for (const category of download) {
      let obj = { sub: category}
      catQuery.push(obj)
    }
    let results = await getResults(catQuery)

    //zip all the files together dynamically
    let zip = new JSZip()
    for (const category of results) {
      if (category.sounds.length == 0) {
        continue
      }
      let folderName = category.sub.replace("/","-")
      let catFolder = zip.folder(folderName)
      for (const sound of category.sounds) {
        let fileName = sound.substring(sound.lastIndexOf("/")+1, sound.length)
        let filePath = "../project/server" + sound
        catFolder.file(fileName, fs.readFileSync(filePath))
      }
    }

    res.set('Content-Type', 'application/zip')
    res.set('Content-Disposition', 'attachment; filename=sounds.zip')
    zip.generateNodeStream({type: 'nodebuffer', streamFiles: true})
    .pipe(res)
    console.log("Zip file generated and downloaded!")
  }
})

/** takes in array of subcategories to find (with syntax { sub: "name"})
 *  returns array of docs containing category name and array of paths
 *  for audio files
 */
async function getResults(queryArray) {
  let cursor = await sound_categories.find({
    $or: queryArray
  })

  return cursor.project({_id: 0, sub: 1, sounds: 1}).toArray()
}

module.exports = router