//mongo.js - Mongodb Connect & getDatabase functions

const MongoClient = require('mongodb').MongoClient
var _db;
require('dotenv').config()

module.exports = {
  dbConnect: callback => {
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

    MongoClient.connect(mongoURL, {useUnifiedTopology: true}, (err, client) => {
      console.log("Connected to MongoDB!")
      _db = client.db(process.env.MONGO_DB)
      return callback(err)
    })
  },
  getDb: () => {
    return _db
  }
}