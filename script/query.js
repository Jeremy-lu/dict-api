'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')
const _ = require('lodash')

model.find({}, (err, data) => {
  let arr = data.map((item) => {
    // return _.pick(item, ['name', 'pinyin', 'viviId', 'zdicId', 'zdicLink', 'createdAt', 'updatedAt'])
    return item
  })

  console.log(JSON.stringify(arr, null, 2))
})
