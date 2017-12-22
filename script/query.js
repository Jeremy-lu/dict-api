'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')

// model.update({}, { viviSyncStatus: 'sync' }, (err, data) => {
//   console.log(err)
// })

model.findOne({name: '褱'}, (err, data) => {
  console.log(err, data)
})
