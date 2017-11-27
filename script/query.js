'use strict';

require('../util/db/helper').initPool()

let model = require('../model/word.js')

model.createAll([{name: 1, viviId: 1}, {name: 2, viviId: 2}], (err, data) => {
  console.log(err, data)
})
