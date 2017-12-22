'use strict'

const fs = require('fs')

module.exports = (client, cb) => {
  let data = JSON.parse(fs.readFileSync(__dirname + '/_word').toString())

  data = data.slice(0, 300)

  data.forEach((item) => {
    item.xiaoSyncStatus = 'sync'
    item.viviSyncStatus = 'sync'
    item.uncleSyncStatus = 'sync'
    item.zdicLinkSyncStatus = 'finished'
    item.zdicSyncStatus = 'sync'
    item.zdicCalligraphySyncStatus = 'sync'
    item.bishunSyncStatus = 'sync'
  })

  client.insert('word', data).run(cb)
}
