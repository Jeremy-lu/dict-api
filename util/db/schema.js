'use strict'

var schema = {}

schema.user = {
  name: 'user',
  columns: [
    { name: 'name', type: 'text' },
    { name: 'mobile', type: 'text', notNull: true },
    { name: 'password', type: 'text' },
    { name: 'sex', type: 'text' },
    { name: 'profession', type: 'text' },
    { name: 'address', type: 'text' },
  ]
}

schema.word = {
  name: 'word',
  columns: [
    { name: 'name', type: 'text' },
    { name: 'pinyin', type: 'text' },
    { name: 'descr', type: 'text' },
    { name: 'radical', type: 'text' },
    { name: 'strokeCount', type: 'int' },
    { name: 'dynamicWrite', type: 'text' },
    { name: 'strokeOrder', type: 'text' },
    { name: 'viviId', type: 'text' },
    { name: 'viviInfo', type: 'text' },
    { name: 'xiaoId', type: 'text' },
    { name: 'xiaoInfo', type: 'text' },
    { name: 'uncleId', type: 'text' },
    { name: 'uncleInfo', type: 'text' },
    { name: 'zdicId', type: 'text' },
    { name: 'zdicLink', type: 'text' },
    { name: 'zdicInfo', type: 'text' },
    { name: 'zdicCalligraphyLink', type: 'text' },
    { name: 'zdicCalligraphyInfo', type: 'text' },
    { name: 'viviSyncStatus', type: 'text' },
    { name: 'xiaoSyncStatus', type: 'text' },
    { name: 'uncleSyncStatus', type: 'text' },
    { name: 'zdicLinkSyncStatus', type: 'text' },
    { name: 'zdicSyncStatus', type: 'text' },
    { name: 'zdicCalligraphySyncStatus', type: 'text' },
    { name: 'bishunSyncStatus', type: 'text' },
  ]
}

module.exports = schema
