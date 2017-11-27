'use strict';

var schema = {};

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
};

schema.word = {
  name: 'word',
  columns: [
    { name: 'name', type: 'text' },
    { name: 'pinyin', type: 'text' }
  ]
};

module.exports = schema;
