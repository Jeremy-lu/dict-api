'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')
const _ = require('lodash')

model.find({}, (err, data) => {
  let arr = data.map((item) => {
    item.zdicId = item.zdicLink.split('/js/')[1].split('.')[0]

    return _.pick(item, ['name', 'pinyin', 'viviId', 'zdicId', 'zdicLink', 'createdAt', 'updatedAt'])
  })

  console.log(JSON.stringify(arr, null, 2))
})
