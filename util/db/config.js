'use strict'

let baseDbName = 'dic'
let dbName = process.env.FRAMEWORK_EXPRESS_ENV === 'test' ? `${baseDbName}_test` : baseDbName

module.exports = {
  baseDbName,
  dbName,
  connectConfig: {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    charset  : 'utf8mb4',
    database : dbName
  }
}
