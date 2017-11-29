'use strict';

const SuperController = require('./super')

class ImageController extends SuperController {
  constructor() {
    super();

    this.error = require('../error/image');
    this.filter = require('../filter/image');
    this.model = require('../model/image');
  }
}

module.exports = new ImageController()
