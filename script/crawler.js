'use strict'

require('../util/db/helper').initPool()

let wordModel = require('../model/word.js')
let syncHelper = require('../util/sync-helper')

syncHelper.getWordList((err, wordList) => {
  wordList.forEach((item) => {
    Object.assign(item, {
      xiaoSyncStatus: 'sync',
      viviSyncStatus: 'sync',
      uncleSyncStatus: 'sync',
      zdicLinkSyncStatus: 'sync',
      zdicSyncStatus: 'sync',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    })
  })

  wordModel.createAll(wordList, (err) => {
    console.log('finished', err)
  })
})
