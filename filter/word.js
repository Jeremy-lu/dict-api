'use strict';

const attrConfigs = {
  name: { type: 'string', fuzzySearch: true },
  pinyin: { type: 'string', fuzzySearch: true },
  dynamicWrite: { type: 'string' },
  strokeOrder: { type: 'string' },
  viviId: { type: 'string' },
  viviInfo: { type: 'string' },
  xiaoId: { type: 'string' },
  xiaoInfo: { type: 'string' },
  uncleId: { type: 'string' },
  uncleInfo: { type: 'string' },
  zdicId: { type: 'string' },
  zdicInfo: { type: 'string' },
  zdicLink: { type: 'string' },
};

module.exports = require('./helper').generate(attrConfigs);
