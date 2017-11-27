'use strict';

const validator = require('../util/validator');

const attrConfigs = {
  name: { type: 'string', fuzzySearch: true },
  mobile: { type: 'string', validate: validator.mobile, fuzzySearch: true },
  password: { type: 'string', returnable: false },
  sex: { type: 'number' },
  profession: { type: 'string' },
  address: { type: 'string' },
};

module.exports = require('./helper').generate(attrConfigs);
