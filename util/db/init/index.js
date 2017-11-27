'use strict'

const async = require('async')
const dbHelper = require('../../db/helper')
const dbConfig = require('../config')

let schema = require('../schema')
let initTableSql = require('./schema2sql')(schema)

let runSql = (dbName, sql, cb) => {
  dbHelper.initPool(dbName)

  dbHelper.getClient((err, client) => {
    if(err) return cb(err)

    client.query(sql, (err) => {
      client.release()
      cb(err)
    })
  })
}

const resetDb = (dbName, cb) => {
  console.log(`try init database ${ dbName }`)

  let dropDbSql = `drop database if exists ${ dbName }`
  let createDbSql = `create database ${ dbName }`

  async.applyEachSeries([
    (done) => {
      runSql('mysql', dropDbSql, (err) => {
        console.log(`droped`)
        done(err)
      })
    },

    (done) => {
      runSql('mysql', createDbSql, (err) => {
        console.log(`re-builded`)
        done(err)
      })
    },

    (done) => {
      async.eachSeries(initTableSql, (sqlStr, done) => {
        runSql(dbName, sqlStr, (err) => {
          done(err)
        })
      }, (err) => {
        console.log(`initialized`)
        done(err)
      })
    },

    (done) => {
      dbHelper.getClient((err, client) => {
        if(err) return done(err)

        const defaultData = require('./default')
        defaultData(client, (err) => {
          console.log('add default data')
          done(err)
        })
      })
    },
  ], (err) => {
    console.log(`finished!\n`)
    cb(err)
  })
}

let dbList = [dbConfig.baseDbName, `${dbConfig.baseDbName}_test`]
async.eachSeries(dbList, resetDb, (err) => {
  if(err) {
    console.log(err)
  } else {
    console.log('all finished!!')
  }
})
