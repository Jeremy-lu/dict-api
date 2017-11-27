'use strict';

// process.env.DEMO_BANK_ENV = 'test';
require('../util/db/helper').initPool()

let model = require('../model/user.js')

model.find({where: {}}, (err, data) => {
  console.log(err, data)
})
