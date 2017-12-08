'use strict';

require('../util/db/helper').initPool()

let model = require('../model/word.js')

model.findById(1, (err, data) => {
  console.log(err, data)

  let viviInfo = JSON.parse(data.viviInfo)
  //
  // console.log(viviInfo)
})
