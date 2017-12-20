'use strict';

const SuperController = require('./super')

class WordController extends SuperController {
  constructor() {
    super();

    this.error = require('../error/word');
    this.filter = require('../filter/word');
    this.model = require('../model/word');
  }

  formatOne(item) {
    if(!item) return item

    let partList = ['viviInfo', 'xiaoInfo', 'uncleInfo']
    partList.forEach((part) => {
      item[part] = JSON.parse(item[part] || '{}')
    })

    return item
  }
}

module.exports = new WordController()
