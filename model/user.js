'use strict'

const SuperModel = require('./super')

class UserModel extends SuperModel {
  constructor() {
    super()

    this.name = 'user'
  }
}

module.exports = new UserModel()
