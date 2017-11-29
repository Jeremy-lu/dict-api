'use strict'

const SqlBricks = require('sql-bricks')
const _ = require('lodash')
const dbHelper = require('../util/db/helper')

class SuperModel {
  constructor() {
    this.order = 'createdAt desc'
  }

  create(data, cb) {
    let currTime = new Date().getTime();
    data.createdAt = currTime;
    data.updatedAt = currTime;
    dbHelper.getClient((err, client) => {
      if(err || !client) return cb('cannot get db client')

      client.insert(this.name, data).row((err, data) => {
        if(err) {
          cb(err)
          client.release()
          return
        }

        client.select().from(this.name).where({id: data.insertId}).row((err, data) => {
          cb(err, data)

          client.release()
        })
      });
    })
  }

  createAll(infoList, cb) {
    if(!infoList || infoList.length === 0) return cb(null, [])

    let currTime = new Date().getTime()

    infoList.forEach((data) => {
      data.createdAt = currTime
      data.updatedAt = currTime
    })

    dbHelper.getClient((err, client) => {
      if(err || !client) return cb('cannot get db client')

      client.insert(this.name, infoList).rows((err, result) => {
        if(err) {
          cb(err)
          client.release()
          return
        }

        let minId = result.insertId;
        let maxId = result.insertId + result.affectedRows - 1;

        let cond = SqlBricks.between('id', minId, maxId)
        client.select().from(this.name).where(cond).rows((err, data) => {
          cb(err, data)

          client.release()
        })
      })
    })
  }

  findById(id, cb, options) {
    let columnStr = '`' + this.name + '`.*'

    if(options && options.otherColumns) {
      columnStr += `, ${options.otherColumns.join(',')}`
    }

    dbHelper.getClient((err, client) => {
      if(err || !client) return cb('cannot get db client')

      client.select(columnStr).from(this.name).where({ id }).row((err, data) => {
        cb(err, data)

        client.release()
      })
    })
  }

  findOne(cond, cb) {
    dbHelper.getClient((err, client) => {
      if(err || !client) return cb('cannot get db client')

      let query = client.select().from(this.name).where(cond).limit(1)

      if(this.order) query.orderBy(this.order)

      query.row((err, data) => {
        cb(err, data)

        client.release()
      })
    })
  }

  findByIdList(idList, cb) {
    if(idList.length === 0) return cb(null, [])

    dbHelper.getClient((err, client) => {
      if(err || !client) return cb('cannot get db client')

      let query = client.select().from(this.name).where(SqlBricks.in('id', idList))
      // console.log(query.clone().toString())
      query.rows((err, data) => {
        cb(err, data)

        client.release()
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
      if(err || !client) return cb('cannot get db client')

      let query = client.select(columnStr).from(this.name)
      dbHelper.getJoinQuery(query, options.where)

      query.limit(options.limit).offset(options.offset)

      let order = options.order || this.order
      if(order) query.orderBy(order)

      // console.log(query.clone().toString())
      query.rows((err, data) => {
        cb(err, data)

        client.release()
      })
    })
  }

  updateById(id, data, cb) {
    data.updatedAt = new Date().getTime()

    dbHelper.getClient((err, client) => {
      if(err || !client) return cb('cannot get db client')

      client.update(this.name, data).where({ id }).run((err) => {
        if(err) {
          cb(err)
          client.release()
          return
        }

        client.select().from(this.name).where({ id }).row((err, data) => {
          cb(err, data)

          client.release()
        })
      })
    })
  }

  update(cond, newInfo, cb) {
    newInfo.updatedAt = new Date().getTime()

    dbHelper.getClient((err, client) => {
      if(err || !client) return cb('cannot get db client')

      client.select('id').from(this.name).where(cond).rows((err, data) => {
        if(err) {
          cb(err)
          client.release()
          return
        }

        if(!data || data.length === 0) {
          cb(null, null)
          client.release()
          return
        }

        let idList = _.map(data, 'id')
        let query = client.update(this.name, newInfo).where(cond)
        query.rows((err) => {
          if(err) {
            cb(err)
            client.release()
            return
          }

          client.select().from(this.name).where(SqlBricks.in('id', idList)).rows((err, data) => {
            cb(err, data)

            client.release()
          })
        })
      })
    })
  }

  removeById(id, cb) {
    dbHelper.getClient((err, client) => {
      if(err || !client) return cb('cannot get db client')

      client.select().from(this.name).where({ id }).row((err, data) => {
        if(err) {
          cb(err)
          client.release()
          return
        }

        if(!data || data.length === 0) {
          cb(null, null)
          client.release()
          return
        }

        client.delete().from(this.name).where({ id }).run((err) => {
          cb(err, data)

          client.release()
        })
      })
    })
  }

  remove(cond, cb) {
    dbHelper.getClient((err, client) => {
      if(err || !client) return cb('cannot get db client')

      client.select().from(this.name).where(cond).rows((err, data) => {
        if(err) {
          cb(err)
          client.release()
          return
        }

        client.delete().from(this.name).where(cond).run((err) => {
          cb(err, data)

          client.release()
        })
      })
    })
  }

  count(where, cb) {
    dbHelper.getClient((err, client) => {
      if(err || !client) return cb('cannot get db client')

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
        cb(err, result ? parseInt(result.count) : 0)

        client.release()
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
      if(err || !client) return cb('cannot get db client')

      client
        .select(`${columns.join(', ')}, count(*) as count`)
        .from(this.name)
        .where(cond)
        .groupBy(columns)
        .run((err, data) => {
          cb(err, data)

          client.release()
        })
    })
  }
}

module.exports = SuperModel
