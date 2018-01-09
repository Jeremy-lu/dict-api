'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')

let zdicCalligraphyInfo = '[{"id":"z","title":"篆","imgList":[]},{"id":"l","title":"隶","imgList":[]},{"id":"k","title":"楷","imgList":[]},{"id":"x","title":"行","imgList":[]},{"id":"c","title":"草","imgList":[]}]'

model.update({zdicCalligraphyInfo: zdicCalligraphyInfo}, {zdicCalligraphySyncStatus: 'sync'}, (err, data) => {
  console.log(err)
})
