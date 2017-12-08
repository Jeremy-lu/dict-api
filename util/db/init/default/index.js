'use strict'

let async = require('async')

module.exports = (db, cb) => {
  async.applyEach([
    (done) => require('./user')(db, done),
    (done) => require('./word')(db, done),
  ], (err) => {
    if(cb) cb(err)
  })
}
