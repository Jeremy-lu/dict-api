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
    { name: 'viviId', type: 'text' },
    { name: 'viviInfo', type: 'text' },
    { name: 'xiaoId', type: 'text' },
    { name: 'xiaoInfo', type: 'text' },
    { name: 'uncleId', type: 'text' },
    { name: 'uncleInfo', type: 'text' },
    { name: 'viviSyncStatus', type: 'text' },
    { name: 'xiaoSyncStatus', type: 'text' },
    { name: 'uncleSyncStatus', type: 'text' },
  ]
}

schema.image = {
  name: 'image',
  columns: [
    { name: 'url', type: 'text' },
    { name: 'desc', type: 'text' },
    { name: 'wordId', type: 'int' },
    { name: 'order', type: 'int' },
  ]
}

module.exports = schema
