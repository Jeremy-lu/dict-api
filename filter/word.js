'use strict';

const attrConfigs = {
  name: { type: 'string', fuzzySearch: true }
};

module.exports = require('./helper').generate(attrConfigs);
