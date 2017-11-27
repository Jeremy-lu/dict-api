'use strict'

const SqlBricks = require('sql-bricks')
const dbHelper = require('../util/db/helper')
const helper = require('../util/helper')
const async = require('async')
const modelHelper = require('./helper')

class SuperModel {
  constructor() {
    this.client = null
    this.order = 'createdAt desc'
  }

  create(client, info, cb) {
    if(!this._isClient(client)) {
      cb = info
      info = client
      client = null
    }

    if(client) {
      this._create(client, info, cb)
    } else {
      let returnData = null

      modelHelper.transQuery((client, transCb) => {
        this._create(client, info, (err, data) => {
          returnData = data
          transCb(err)
        })
      }, (err) => {
        cb(err, returnData)
      })
    }
  }

  _create(client, info, cb) {
    let self = this

    let currTime = helper.getDatetimp()
    info.createdAt = currTime
    info.updatedAt = currTime

    // console.log(self.name, info)
    client.insert(self.name, info).row((err, data) => {
      if(err) return cb(err)
      let id = data.insertId

      client.select().from(self.name).where({ id }).row((err, data) => {
        // console.log(info, data)
        cb(err, data)
      })
    })
  }

  findById(id, cb, options) {
    let columnStr = '`' + this.name + '`.*'

    if(options && options.otherColumns) {
      columnStr += `, ${options.otherColumns.join(',')}`
    }

    dbHelper.getClient((err, client) => {
      if(err) return cb(err)

      let query = client.select(columnStr).from(this.name).where({ id })
      // console.log(query.clone().toString())
      query.row((err, data) => {
        client.release()

        cb(err, data)
      })
    })
  }

  findByIdList(idList, cb) {
    if(idList.length === 0) return cb(null, [])

    dbHelper.getClient((err, client) => {
      if(err) return cb(err)

      let query = client.select().from(this.name).where(SqlBricks.in('id', idList))
      // console.log(query.clone().toString())
      query.rows((err, data) => {
        client.release()

        cb(err, data)
      })
    })
  }

  find(options, cb) {
    let columnStr = ''
    if(options.columns) {
      columnStr = options.columns
    } else {
      columnStr = '`' + this.name + '`.*'
    }

    if(options.otherColumns) {
      columnStr += `, ${options.otherColumns.join(',')}`
    }


    dbHelper.getClient((err, client) => {
      if(err) return cb(err)

      let query = client.select(columnStr).from(this.name)
      dbHelper.getJoinQuery(query, options.where)

      query.limit(options.limit).offset(options.offset)

      let order = options.order || this.order
      if(order) query.orderBy(order)

      // console.log(query.clone().toString())
      query.rows((err, data) => {
        client.release()

        cb(err, data)
      })
    })
  }

  findOne(cond, cb) {
    dbHelper.getClient((err, client) => {
      if(err) return cb(err)

      let query = client.select().from(this.name).where(cond).limit(1)

      if(this.order) query.orderBy(this.order)

      query.row((err, data) => {
        client.release()

        cb(err, data)
      })
    })
  }

  updateById(client, id, newInfo, cb) {
    if(!this._isClient(client)) {
      cb = newInfo
      newInfo = id
      id = client
      client = null
    }

    if(client) {
      this._updateById(client, id, newInfo, cb)
    } else {
      let returnData = null

      modelHelper.transQuery((client, transCb) => {
        this._updateById(client, id, newInfo, (err, data) => {
          returnData = data
          transCb(err)
        })
      }, (err) => {
        cb(err, returnData)
      })
    }
  }

  _updateById(client, id, newInfo, cb) {
    let self = this

    let currTime = helper.getDatetimp()
    newInfo.updatedAt = currTime

    client.select().from(this.name).where({ id }).row((err, data) => {
      if(err) return cb(err)
      if(!data) return cb(null, null)

      client.update(self.name, newInfo).where({ id }).run((err) => {
        if(err) return cb(err)

        client.select().from(self.name).where({ id }).row((err, data) => {
          cb(err, data)
        })
      })
    })
  }

  removeById(client, id, cb) {
    if(!this._isClient(client)) {
      cb = id
      id = client
      client = null
    }

    if(client) {
      this._removeById(client, id, cb)
    } else {
      let returnData = null

      modelHelper.transQuery((client, transCb) => {
        this._removeById(client, id, (err, data) => {
          returnData = data
          transCb(err)
        })
      }, (err) => {
        cb(err, returnData)
      })
    }
  }

  _removeById(client, id, cb) {
    let self = this

    client.select().from(this.name).where({ id }).row((err, data) => {
      if(err) return cb(err)
      if(!data || data.length === 0) return cb(null, null)

      client.delete().from(self.name).where({ id }).run((err) => {
        cb(err, data)
      })
    })
  }

  count(where, cb) {
    dbHelper.getClient((err, client) => {
      if(err) return cb(err)

      let query = client.select('count(*) as count').from(this.name)
      if(where instanceof Array) {
        where.forEach((item, index) => {
          query = index === 0 ? query.where(item) : query.and(item)
        })
      } else {
        query = query.where(where)
      }
      // console.log(query.clone().toString())
      query.row((err, result) => {
        client.release()

        cb(err, result ? parseInt(result.count) : 0)
      })
    })
  }

  groupBy(columns, cond, cb) {
    if(typeof columns === 'string') {
      columns = [columns]
    }

    if(typeof cond === 'function') {
      cb = cond
      cond = null
    }

    dbHelper.getClient((err, client) => {
      if(err) return cb(err)

      client
        .select(`${columns.join(', ')}, count(*) as count`)
        .from(this.name)
        .where(cond)
        .groupBy(columns)
        .run((err, data) => {
          client.release()

          cb(err, data)
        })
    })
  }

  _isClient(client) {
    return (typeof client.query === 'function') && (typeof client.select === 'function')
  }
}

module.exports = SuperModel
