'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')
const _ = require('lodash')

model.find({limit: 2}, (err, data) => {
  let attrs = [
    'name', 'pinyin', 'radical', 'strokeCount', 'dynamicWrite', 'strokeOrder',
    'viviId', 'xiaoId', 'uncleId', 'zdicId',
    'zdicLink', 'zdicCalligraphyLink',
    'createdAt', 'updatedAt'
  ]

  let arr = data.map((item) => {
    return _.pick(item, attrs)
  })

  console.log(JSON.stringify(arr, null, 2))
})
