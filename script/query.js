'use strict';

require('../util/db/helper').initPool()

let model = require('../model/word.js')

model.update({}, {uncleSyncStatus: 'sync'}, (err, data) => {
  console.log(err, data)
})
