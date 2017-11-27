'use strict'

const SuperModel = require('./super')

class WordModel extends SuperModel {
  constructor() {
    super()

    this.name = 'word'
  }
}

module.exports = new WordModel()
