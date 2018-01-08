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

    item.viviInfo = JSON.parse(item.viviInfo || '{}')
    item.xiaoInfo = JSON.parse(item.xiaoInfo || '{}')
    item.uncleInfo = JSON.parse(item.uncleInfo || '[]')
    item.zdicCalligraphyInfo = JSON.parse(item.zdicCalligraphyInfo || '[]')

    item.zdicCalligraphyInfo.forEach((item) => {
      item.imgList.forEach((img) => {
        img.url = img.url.replace('zdicsfpic.zdic.net', 'sf.zdic.net')
      })
    })

    return item
  }
}

module.exports = new WordController()
