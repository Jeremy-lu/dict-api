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

    if(item.viviInfo) {
      if(item.viviInfo.desc) item.viviInfo.desc = unescape(item.viviInfo.desc)
      if(item.viviInfo.explain) item.viviInfo.explain = JSON.parse(unescape(item.viviInfo.explain))
    }

    return item
  }
}

module.exports = new WordController()
