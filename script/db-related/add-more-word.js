// continue add more word

const dbHelper = require('../../util/db/helper')
dbHelper.initPool()

const SqlBricks = require('sql-bricks')
const _ = require('lodash')
const wordModel = require('../../model/word')

let nameGroupList = [
  // 20180121
  '刘婷斌哈杏',
]

let nameList = []
nameGroupList.forEach((item) => {
  nameList = nameList.concat(item.split(''))
})

wordModel.find({where: SqlBricks.in('name', nameList), columns: ['name']}, (err, list) => {
  let existedNameList = _.map(list, 'name')

  let newNameList = _.difference(nameList, existedNameList)

  let currTime = new Date().getTime()
  let wordInfoList = newNameList.map((name) => {
    return {
      name: name,
      xiaoSyncStatus: 'sync',
      viviSyncStatus: 'sync',
      uncleSyncStatus: 'sync',
      zdicLinkSyncStatus: 'sync',
      zdicSyncStatus: 'sync',
      zdicCalligraphySyncStatus: 'sync',
      bishunSyncStatus: 'sync',
      createdAt: currTime,
      updatedAt: currTime,
   }
  })

  wordModel.createAll(wordInfoList, (err) => {
    console.log('finished', err)
  })
})
