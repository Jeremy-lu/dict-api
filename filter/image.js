'use strict';

const attrConfigs = {
  url: { type: 'string' },
  desc: { type: 'string' },
};

module.exports = require('./helper').generate(attrConfigs);
