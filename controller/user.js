'use strict';

const SuperController = require('./super')
const helper = require('../util/helper')

class UserController extends SuperController {
  constructor() {
    super();

    this.error = require('../error/user');
    this.filter = require('../filter/user');
    this.model = require('../model/user');
  }

  create(params, cb) {
    if(params.password) {
      params.password = helper.encrypt(params.password);
    }

    this.model.findOne({mobile: params.mobile}, (err, user) => {
      if(err) return cb(err)
      if(user) return cb(this.error.already.registed.mobile())

      new SuperController().create.call(this, params, cb);
    })
  }

  update(id, params, cb) {
    id = parseInt(id)
    if(params.password) {
      params.password = helper.encrypt(params.password);
    }

    this.model.findOne({mobile: params.mobile}, (err, user) => {
      if(err) return cb(err)
      if(user && (user.id !== id)) return cb(this.error.already.registed.mobile())

      new SuperController().update.call(this, id, params, cb);
    })
  }

  uniqCheck(params, cb) {
    let type = params.type
    delete params.type

    this.model.count(params, (err, count) => {
      cb(err, count > (type === 'update' ? 1 : 0) ? false : true)
    })
  }
}

module.exports = new UserController()
