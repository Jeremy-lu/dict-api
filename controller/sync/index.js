'use strict'

require('../../util/db/helper').initPool()
const wordModel = require('../../model/word')
const async = require('async')

module.exports = {
  stats(cb) {
    let result = {}

    async.each(['uncle', 'vivi', 'xiao'], (item, done) => {
      let statusColumn = item + 'SyncStatus'

      wordModel.groupBy(statusColumn, (err, data) => {
        let stats = { unfinished: 0, finished: 0 }
        data.forEach((item) => {
          if(item[statusColumn] === 'finished') {
            stats.finished += item.count
          } else {
            stats.unfinished += item.count
          }
        })
        result[item] = stats
        done()
      })
    }, () => {
      cb(null, result)
    })
  }
}

module.exports.stats((err, result) => {
  console.log(err, result)
})
