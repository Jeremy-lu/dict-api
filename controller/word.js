'use strict';

const SuperController = require('./super')
const imageModel = require('../model/image')

class WordController extends SuperController {
  constructor() {
    super();

    this.error = require('../error/word');
    this.filter = require('../filter/word');
    this.model = require('../model/word');
  }

  getById(id, cb) {
    new SuperController().getById.call(this, id, (err, item) => {
      if(err) return cb(err)

      this._appendImageList(item, () => {
        cb(null, item)
      })
    });
  }

  _appendImageList(item, cb) {
    imageModel.find({ where: { wordId: item.id } }, (err, list) => {
      item.imageList = list || []
      cb()
    })
  }
}

module.exports = new WordController()
