'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')

model.find({}, (err, data) => {
  console.log(err, data)
})
