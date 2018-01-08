'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')

model.find({ columns: ['name', 'zdicCalligraphyInfo'] }, (err, data) => {
  console.log(JSON.stringify(data, null, 2))
})
