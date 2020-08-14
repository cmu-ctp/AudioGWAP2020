//dataset.js - Dataset page route module

const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo')
const db = mongo.getDb()
const sound_categories = db.collection('sound_categories')
const wfi = require('wav-file-info')
const fs = require('fs')

// categories are hardcoded as of now, change in future to get from database
const categoryList = ["Kitchen", "Bathroom", "Living/Bedroom", "Garage", "Ambience", "Concerning"]

/** Route for search results
 *  Searches database from the query operators in URL
 * 
 * Query params: q = search query
 *               strict = if 1, search only for exact matches. Otherwise, do a general text search.
 * 
 * Variables passed to pug:
 * results: Array of categories, each category matches their schema in the database, however their sounds
 * array has been changed from an array of paths to each sound, to an array of objects where each one
 * contains information about that sound.
 * ex: [
 *    {
 *      _id: ObjectId (objectid of this subcategory in the sound_categories database)
 *      parent: 'Kitchen'
 *      sub: 'Cooking'
 *      sounds: [
 *        {
 *          path: '/upload/path/to/file.wav'
 *          fileSize: '235.2 KB' (file size converted to a string)
 *          bitDepth: '16 bit' (bit depth converted to a string)
 *          sampleRate: '44100 hz' (sample rate converted to a string)
 *          duration: "0:05" (duration converted to seconds, rounded, as a string)
 *          lastMod: "8/13/2020" (Currently using mtime, should eventually be converted to date validated)
 *        }, 
 *        ...
 *      ]
 *    },
 *    ...
 * ]
 * query: Search query given by the user, string. Ex: 'cooking'
 * count: Number of sounds found that match the search criteria, number
 * totalSize: Total file size converted to a string, same format as fileSize in sounds objects
 * 
 * TODO: Work with server-side/validation team to get a timestamp of validation somehow, to be shown on the interface
 */
router.get('/search/', async (req, res) => {
  const { q, strict } = req.query
  let results = []
  if (q && q.length > 0) {
      results = await getResults(q, strict)
  }
  /* if (q) {
      console.log('Query: ' + q + ', Strict:' + strict)
  } */

  /*somewhat hacky setup to make sure all wav files done analyzing
    if you have a better idea, feel free to modify
    gets count of # of sounds first, then checks count to decide when to render*/

  // if none found skip all the analysis
  let numFound = 0
  results.forEach(category => {
    numFound += category.sounds.length
  });
  let totalSize = 0

  if (numFound === 0) {
    res.render('search', {
      results: results, 
      query: q, 
      count: numFound,
      totalSize: '0 B'
    })
  } else { // start analyzing the wav files
    let analysisCount = 0
    for (const category of results) {
      let len = category.sounds.length
      // analyze each sound in the array of paths that category has
      for (let i = 0; i < len; i++) {
        let sound = category.sounds[i]
        // this is used in order to get bit depth and sample rate, which clients eventually
        // want to be displayed on the interface.
        wfi.infoByFilename('../project/server' + sound, (err, info) => {
          let obj
          if (err) {
            console.log(err)
            obj = {
              path: sound,
              fileSize: 'Error',
              bitDepth: 'Error',
              sampleRate: 'Error',
              duration: 'Error',
              lastMod: 'Error'
            }
          } else {
            let size = info.stats.size
            totalSize += size
            obj = {
              path: sound,
              fileSize: convertSize(size),
              bitDepth: info.header.bits_per_sample.toString() + ' bit',
              sampleRate: info.header.sample_rate.toString() + ' Hz',
              duration: decSecToTime(info.duration),
              lastMod: info.stats.mtime.toLocaleDateString('en-US')
            }
          }
          // end result is replacing all sound paths with an object containing info about the sound
          category.sounds[i] = obj
          analysisCount++
          // Checks if this is the last file to be analyzed
          if (analysisCount === numFound) {
            totalSize = convertSize(totalSize)
            // console.log('Rendering page!')
            res.render('search', {
              results: results, 
              query: q, 
              count: numFound,
              totalSize: totalSize
            })
          }
        })
      }
    }
  }
})

/** Route for general dataset landing page
 *  Populates list of categories via hardcoded array (for now), searches
 *  db to get list of subcategories for each parent category
 * 
 * Query params: cat = category to show already expanded (vs. all collapsed)
 * 
 * Variables passed to pug:
 * ontology: Object, contains one key for each parent category, whose value is an array of all its subcategories
 * following the sound_categories database schema. Each subcategory has extra fields for fileSize and last modified.
 * ex: {
 *  Kitchen: [
 *    {
 *      _id: ObjectId (objectid of subcategory in sound_categories database)
 *      parent: 'Kitchen',
 *      sub: 'Cooking',
 *      sounds: [ '/path/to/file1.wav', '/path/to/file2.wav', ... ],
 *      fileSizes: '893.1 KB' (file size converted to a string)
 *      lastMod: '12/10/2019' (date string)
 *    },
 *    ...
 *  ],
 *  ...
 * }
 * The next three values all follows this pattern
 * ex: {
 *  Kitchen: 65, //counts | '17.9 MB' //fileSizes | '2/19/2020' // lastModified
 *  ...
 * }
 * counts: Object, contains one key for each parent category, value is number of sounds in that parent category
 * fileSizes: Object, contains one key for each parent category, value is the total filesize of that parent category as a string
 * lastModified: Object, contains one key for each parent category, value is the date the parent category was last modified as a string
 * shownCategory: Either urlencoded parameter for the parent category to have open at default, or empty string "" if none passed
 */
router.get('/', async (req, res) => {
  let ontology = {}
  let counts = {}
  let fileSizes = {}
  let lastModified = {}
  let shownCategory = req.query.cat || "";

  // this should eventually be changed to get the list of categories from the database
  for(const category of categoryList) {
    let subCats = await getSubCategories(category)
    ontology[category] = subCats

    let categoryCount = 0
    let categoryFileSizes = 0
    let categoryLastMod = 0

    // get stats for parent category and each sub category
    for (const subCat of subCats) {
      categoryCount += subCat.sounds.length

      let subCatFileSizes = 0
      let subCatLastMod = 0

      // update filesizes and last modified
      for (const sound of subCat.sounds) {
        let stats;
        try {
          stats = fs.statSync('../project/server' + sound)
        } catch (err) {
          console.log(err);
          continue;
        }
        categoryFileSizes += stats.size
        subCatFileSizes += stats.size
        if (stats.mtimeMs > categoryLastMod) {
          categoryLastMod = stats.mtimeMs
        }
        if (stats.mtimeMs > subCatLastMod) {
          subCatLastMod = stats.mtimeMs
        }
      }

      subCat.fileSizes = convertSize(subCatFileSizes)

      if (subCatLastMod === 0) {
        subCat.lastMod = 'N/A'
      } else {
        let subCatModDate = new Date(categoryLastMod)
        subCat.lastMod = subCatModDate.toLocaleDateString('en-US')
      }
    }

    fileSizes[category] = convertSize(categoryFileSizes)
    counts[category] = categoryCount

    if (categoryLastMod === 0) {
      lastModified[category] = 'N/A'
    } else {
      let modDate = new Date(categoryLastMod)
      lastModified[category] = modDate.toLocaleDateString('en-US')
    }
  }

  res.render('dataset', {
    ontology: ontology, 
    counts: counts, 
    fileSizes: fileSizes, 
    lastModified: lastModified,
    shownCategory: shownCategory
  })
})

//Searches sound_categories database for categories that match and returns an array containing results
// Arguments: query = subcategory to search for, string
//            strict = if 1, category name must match exactly, otherwise runs a general text search
async function getResults(query, strict = 0) {
  let cursor
  if (strict === 1) {
    cursor = await sound_categories.find({ sub: query })
  } else {
    cursor = await sound_categories.find({
      sub: {$regex: query, $options: 'i'}
    })
  }
  return cursor.sort({
    sub: 1
  }).toArray()
}

//Searches sound_categories database for subcategories with a desired parent category
async function getSubCategories(category) {
  let cursor = await sound_categories.find({'parent': category})
  return cursor.sort({'sub': 1}).toArray()
}

// Converts a given number of bytes into a formatted string of the form 'xxx.x xB', depending on the size
function convertSize(size) {
  if (size < 1000) {
    return size.toString() + " B"
  } else if (size < 1000000) {
    size = size / 1000
    return size.toFixed(1) + " KB"
  } else {
    size = size / 1000000
    return size.toFixed(1) + " MB"
  }
}

// Converts a given amount of seconds into a formatted time string like '0:05' for 5 seconds.
function decSecToTime(decimalSeconds) {
  let mins = Math.floor(decimalSeconds / 60)
  let secs = Math.round(decimalSeconds - (mins * 60))
  let dateString = ''
  if (mins == 0) {
    dateString += '0:'
  } else {
    dateString += (mins.toString() + ':')
  }
  if (secs < 10) {
    dateString += '0'
  }
  dateString += secs.toString()
  return dateString
}

module.exports = router