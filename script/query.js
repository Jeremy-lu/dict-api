'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')

model.find({limit: 3}, (err, data) => {
  console.log(err, data)
})
