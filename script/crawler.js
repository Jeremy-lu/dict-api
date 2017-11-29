'use strict'

require('../util/db/helper').initPool()

let wordModel = require('../model/word.js')
let syncHelper = require('../util/sync-helper')

syncHelper.getWordList((err, wordList) => {
  wordModel.createAll(wordList, (err) => {
    console.log('finished', err)
  })
})
