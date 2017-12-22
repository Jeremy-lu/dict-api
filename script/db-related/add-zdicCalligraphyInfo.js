'use strict'

const async = require('async')
const dbHelper = require('../../util/db/helper')
dbHelper.initPool()

dbHelper.getClient((err, client) => {
  let sqlList = [
    'alter table `word` add column `zdicCalligraphyInfo` text',
    'alter table `word` add column `radical` text, add column `strokeCount` int',
    'alter table `word` add column `zdicCalligraphySyncStatus` text, add column `zdicCalligraphyLink` text',
    'update `word` set `zdicCalligraphySyncStatus`="sync"',
  ]

  let finishedNum = 0

  async.eachSeries(sqlList, (sql, done) => {
    client.query(sql, (err) => {
      finishedNum += 1
      console.log(`${finishedNum}/${sqlList.length}`)
      done(err)
    })
  }, (err) => {
    if(err) return console.log(err)

    console.log('finished')
  })
})
