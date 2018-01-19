'use strict';

const SuperController = require('./super')
const SqlBricks = require('sql-bricks')

class WordController extends SuperController {
  constructor() {
    super();

    this.error = require('../error/word');
    this.filter = require('../filter/word');
    this.model = require('../model/word');
  }

  search(params, cb) {
    let searchStr = params.searchStr
    if(!searchStr) return cb(null, [])

    let words = searchStr.split('')
    let columns = ['id', 'name', 'pinyin', 'descr', 'radical']

    this.model.find({columns, where: SqlBricks.in('name', words)}, (err, list) => {
      cb(err, list)
    })
  }

  formatOne(item) {
    if(!item) return item

    item.viviInfo = JSON.parse(item.viviInfo || '{}')
    item.xiaoInfo = JSON.parse(item.xiaoInfo || '{}')
    item.uncleInfo = JSON.parse(item.uncleInfo || '[]')
    item.zdicCalligraphyInfo = JSON.parse(item.zdicCalligraphyInfo || '[]')
    item.uncleInfo = item.uncleInfo.reverse()

    // modify zdic image url host to void visit forbiden
    item.zdicCalligraphyInfo.forEach((item) => {
      item.imgList.forEach((img) => {
        img.url = img.url.replace('zdicsfpic.zdic.net', 'sf.zdic.net')
      })
    })

    // check if xiaoInfo empty
    item.xiaoEmpty = true
    if(item.xiaoInfo.imgList.length > 0 || item.xiaoInfo.explain.length > 0) {
      item.xiaoEmpty = false
    }

    // check if uncleInfo empty
    item.uncleEmpty = true
    item.uncleInfo.forEach((part) => {
      if(part.imgList.length > 0) item.uncleEmpty = false
    })

    // check if zdicCalligraphy empty
    item.zdicCalligraphyEmpty = true
    item.zdicCalligraphyInfo.forEach((part) => {
      if(part.imgList.length > 0) item.zdicCalligraphyEmpty = false
    })

    return item
  }
}

module.exports = new WordController()
