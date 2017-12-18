'use strict'

module.exports = (client, cb) => {
  let data = [
    { name: '汉', viviId: '2260' },
    { name: '字', viviId: '1597' },
  ]

  data.forEach((item) => {
    item.xiaoSyncStatus = 'sync'
    item.viviSyncStatus = 'sync'
    item.uncleSyncStatus = 'sync'
  })

  client.insert('word', data).run(cb)
}
