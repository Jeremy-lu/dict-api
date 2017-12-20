'use strict';

const SuperController = require('./super')

class WordController extends SuperController {
  constructor() {
    super();

    this.error = require('../error/word');
    this.filter = require('../filter/word');
    this.model = require('../model/word');
  }
}

module.exports = new WordController()
