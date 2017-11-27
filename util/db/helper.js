'use strict'

const mysql = require('mysql')
const SqlBricks = require('sql-bricks')
const MysqlBricks = require('../mysql-bricks')

let dbConfig = require('./config')
let dbPool = null
let lastDbName = null
let dbDebug = false

module.exports = {
  initPool(dbName) {
    dbName = dbName || dbConfig.dbName

    let initPool = () => {
      let connectConfig = Object.assign(dbConfig.connectConfig, {
        connectionLimit : 30,
        database : dbName
      })

      dbPool = mysql.createPool(connectConfig)

      dbPool.on('acquire', (connection) => {
        dbDebug && console.log('Connection %d acquired', connection.threadId);
      })

      dbPool.on('connection', () => {
        dbDebug && console.log('new connection created');
      })

      dbPool.on('enqueue', () => {
        dbDebug && console.log('Waiting for available connection slot');
      });

      dbPool.on('release', (connection) => {
        dbDebug && console.log('Connection %d released', connection.threadId);
      });
    }

    if(dbName !== lastDbName) {
      lastDbName = dbName
      initPool()
    } else if(!dbPool) {
      initPool()
    }
  },

  getClient(cb) {
    if(!dbPool) return cb('db pool not ready')

    dbPool.getConnection((err, connection) => {
      if(err) return cb(err)

      cb(null, MysqlBricks(connection))
    })
  },

  // config can be
  // Array:  [['columnA', 'searchStr'], ['columnB', 'searchStr']]
  // Object: {'columnA': 'searchStr', 'columnB': 'searchStr'}
  getOrQuery(config) {
    if(!config) return null

    let tmpArr = []

    if(config instanceof Array && config.length > 0) {
      config.forEach((item) => {
        tmpArr.push(SqlBricks.like(item[0], `%${item[1]}%`))
      })
    } else if(Object.keys(config).length > 0) {
      for(let attr in config) {
        let val = config[attr]
        tmpArr.push(SqlBricks.like(attr, `%${val}%`))
      }
    }

    if(tmpArr.length === 0) return null
    return SqlBricks.or.apply(SqlBricks, tmpArr)
  },

  getJoinQuery(query, where) {
    if(where instanceof Array) {
      where.forEach((item) => {
        query = query.where(item)
      })
    } else {
      query = query.where(where)
    }
  }
}
