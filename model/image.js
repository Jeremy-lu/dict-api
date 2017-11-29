'use strict'

const SuperModel = require('./super')

class ImageModel extends SuperModel {
  constructor() {
    super()

    this.name = 'image'
  }
}

module.exports = new ImageModel()
