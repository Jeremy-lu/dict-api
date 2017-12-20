'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')

// model.update({}, { viviSyncStatus: 'sync' }, (err, data) => {
//   console.log(err)
// })

model.find({}, (err, data) => {
  console.log(err, data)
})
