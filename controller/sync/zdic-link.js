'use strict';

const wordModel = require('../../model/word')
const SqlBricks = require('sql-bricks')
const _ = require('lodash')
require('colors')

let maxAwaitNum = 100
let minAwaitNum = 20

class ZdicLinkSync {
  constructor() {
    this.runningItems = {}
    this.awaitList = []
    this.currRunningNum = 0
    this.supplyAwaitLock = false
    this.supplyParallelLock = false
  }

  start(isInit) {
    if(isInit) {
      wordModel.update({zdicLinkSyncStatus: 'syncing'}, {zdicLinkSyncStatus: 'sync'}, (err) => {
        if(err) console.log('start word sync job err: ', err)

        this.supplyAwait()
      })
    } else {
      this.supplyAwait()
    }
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
        console.log('get sync list err', err)
      } else {
        this.awaitList = this.awaitList.concat(data)
      }

      this.supplyAwaitLock = false
    })
  }

  getSyncList(num, cb) {
    wordModel.find({where: {zdicLinkSyncStatus: 'sync'}, limit: num || 100}, (err, data) => {
      if(err) return cb(err)
      if(data.length === 0) return cb(null, data)

      let idList = _.map(data, 'id')
      wordModel.update(SqlBricks.in('id', idList), { zdicLinkSyncStatus: 'syncing' }, (err) => {
        cb(err, data)
      })
    })
  }

  getNext(params, cb) {
    if(!params.id) return this._getNext(cb)

    params.zdicLinkSyncStatus = 'finished'
    wordModel.findById(params.id, (err, word) => {
      if(err) return cb(err)
      if(!word) return cb('not find word with id ' + params.id)

      wordModel.updateById(word.id, params, () => {
        this._getNext(cb)
      })
    })
  }

  _getNext(cb) {
    let nextItem = this.awaitList.shift()

    if(!nextItem) return cb('no valid item')

    cb(null, nextItem)

    this.supplyAwait()
  }
}

module.exports = new ZdicLinkSync()
