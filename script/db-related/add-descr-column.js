'use strict'

const async = require('async')
const dbHelper = require('../../util/db/helper')
dbHelper.initPool()

dbHelper.getClient((err, client) => {
  let sqlList = [
    'alter table `word` add column `descr` text',
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
