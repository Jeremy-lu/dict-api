'use strict';

const attrConfigs = {
  name: { type: 'string', fuzzySearch: true },
  viviId: { type: 'string' },
  xiaoId: { type: 'string' },
  viviInfo: { type: 'string' },
  xiaoInfo: { type: 'string' },
  uncleInfo: { type: 'string' },
  xiaoSyncStatus: { type: 'string' },
  viviSyncStatus: { type: 'string' },
  uncleSyncStatus: { type: 'string' },
};

module.exports = require('./helper').generate(attrConfigs);
