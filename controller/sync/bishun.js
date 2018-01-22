'use strict';

const wordModel = require('../../model/word')
const syncHelper = require('../../util/sync-helper')
const SqlBricks = require('sql-bricks')
const _ = require('lodash')
require('colors')

let pre = '[bishun]'.green

let parallelRunNum = 3
let maxAwaitNum = 100
let minAwaitNum = 20

class BishunSync {
  constructor() {
    this.runningItems = {}
    this.awaitList = []
    this.currRunningNum = 0
    this.supplyAwaitLock = false
    this.supplyParallelLock = false
  }

  start(isInit) {
    if(isInit) {
      wordModel.update({bishunSyncStatus: 'syncing'}, {bishunSyncStatus: 'sync'}, (err) => {
        if(err) console.log(pre, 'start word sync job err: ', err)

        this.supplyAwait()
      })
    } else {
      this.supplyAwait()
    }
  }

  supplyParallel() {
    if(this.supplyParallelLock) return
    this.supplyParallelLock = true

    if(this.currRunningNum >= parallelRunNum) {
      this.supplyParallelLock = false
      return
    }

    this.awaitList.splice(0, parallelRunNum - this.currRunningNum).forEach((item) => {
      this.runOne(item)
    })

    this.supplyParallelLock = false
  }

  runOne(item) {
    this.runningItems[item.id] = item
    this.currRunningNum += 1

    console.log(pre, 'starting sync word ' + item.name)
    this.syncOne(item, (err) => {
      console.log(pre, item.name, err ? err.toString().red : '✓ '.green)

      this.currRunningNum -= 1
      delete this.runningItems[item.id]

      let nextItem = this.awaitList.shift()
      if(nextItem) this.runOne(nextItem)

      this.supplyAwait()
    })
  }

  supplyAwait() {
    if(this.supplyAwaitLock) return
    this.supplyAwaitLock = true

    // await list is enough
    if(this.awaitList.length > minAwaitNum) {
      this.supplyAwaitLock = false
      return
    }

    // supply await list
    this.getSyncList(maxAwaitNum - this.awaitList.length, (err, data) => {
      if(err) {
        console.log(pre, 'get sync list err', err)
      } else {
        this.awaitList = this.awaitList.concat(data)

        this.supplyParallel()
      }

      this.supplyAwaitLock = false
    })
  }

  getSyncList(num, cb) {
    wordModel.find({where: {bishunSyncStatus: 'sync'}, limit: num || 100}, (err, data) => {
      if(err) return cb(err)
      if(data.length === 0) return cb(null, data)

      let idList = _.map(data, 'id')
      wordModel.update(SqlBricks.in('id', idList), { bishunSyncStatus: 'syncing' }, (err) => {
        cb(err, data)
      })
    })
  }

  syncOne(word, cb) {
    let updateInfo = { bishunSyncStatus: 'finished' }

    syncHelper.getBishunInfo(word, (err, result) => {
      if(err) {
        console.log(pre, err)
      } else {
        updateInfo.dynamicWrite = result.dynamicWrite
      }

      wordModel.updateById(word.id, updateInfo, (updateErr) => {
        cb(err || updateErr)
      })
    })
  }
}

module.exports = new BishunSync()
