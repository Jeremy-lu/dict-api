'use strict'

let baseDbName = 'dict'
let dbName = process.env.FRAMEWORK_EXPRESS_ENV === 'test' ? `${baseDbName}_test` : baseDbName

module.exports = {
  baseDbName,
  dbName,
  connectConfig: {
    host     : '47.93.97.73',
    user     : 'testuser',
    password : 'testuser',
    // host     : '127.0.0.1',
    // user     : 'root',
    // password : 'root',
    charset  : 'utf8mb4',
    database : dbName
  }
}
