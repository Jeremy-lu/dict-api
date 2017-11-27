'use strict'

const paginator = require('../util/paginator')

class SuperController {
  create(params, cb) {
    let result = this.filter.create(params)
    if(result.error) return cb(result.error)
    params = result.params

    this.model.create(params, (err, data) => {
      cb(err, data && this.filter.return(data))
    })
  }

  update(id, params, cb) {
    let result = this.filter.update(params)
    if(result.error) return cb(result.error)
    params = result.params

    this.model.findById(id, (err, data) => {
      if(err) return cb(err)
      if(!data) return cb(this.error.not.find())

      this.model.updateById(id, params, (err, data) => {
        if(err) return cb(err)
        cb(err, data && this.filter.return(data))
      })
    })
  }

  getById(id, cb) {
    this.model.findById(id, (err, data) => {
      if(err) return cb(err)
      cb(err, data && this.filter.return(data))
    })
  }

  getList(params, cb) {
    // before other filter
    let fuzzySearch = this.filter.getFuzzySearch(params.searchStr)
    let result = this.filter.select(params)
    if(result.error) return cb(result.error)
    params = [result.params, fuzzySearch]

    this.model.find({ where: params }, (err, data) => {
      if(err) return cb(err)

      data = data.map(this.filter.return)
      cb(null, data)
    })
  }

  getPaginatorList(params, paginatorBody, cb) {
    let fuzzySearch = this.filter.getFuzzySearch(params.searchStr)

    let result = this.filter.select(params)
    if(result.error) return cb(result.error)
    params = [result.params, fuzzySearch]

    let offset = paginatorBody.pageSize * (paginatorBody.currPage - 1)

    this.model.find({ where: params, limit: paginatorBody.pageSize, offset }, (err, data) => {
      if(err) return cb(err)

      this.model.count(params, (err, total) => {
        if(err) return cb(err)

        data = data.map(this.filter.return)
        cb(null, data, paginator.createResBody(paginatorBody, total))
      })
    })
  }

  remove(id, cb) {
    let reg = /\d+/
    if(!reg.test(id)) return cb(this.error.invalid.id())

    this.model.findById(id, (err, obj) => {
      if(err) return cb(err)
      if(!obj) return cb(this.error.not.find())

      this.model.removeById(id, (err, obj) => {
        cb(err, obj && this.filter.return(obj))
      })
    })
  }
}

module.exports = SuperController
