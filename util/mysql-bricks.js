'use strict'

/*
 * Extend sql-SqlBricks for mysql
 *
 * add following method
 *    client.run(queryStr, cb) run and don't care about the special of callback
 *    client.rows(cb) return result back through callback
 *    client.row(cb) return the first row of result back through callback
 *    select.limit(limitNum)
 *    select.offset(offsetNum)
 */

const SqlBricks = require('sql-bricks');

module.exports = function(client) {
  ;['select', 'insert', 'update', 'delete'].forEach((stmtName) => {
    client[stmtName] = function() {
      let brick = SqlBricks[stmtName].apply(SqlBricks, arguments)

      brick.run = function (cb) {
        let sqlStr = this.toString();
        client.query(sqlStr, (err, data) => {
          cb(err, data);
        });
      };

      brick.row = function (cb) {
        let sqlStr = this.toString();
        client.query(sqlStr, (err, data) => {
          cb(err, data && data instanceof Array ? data[0] : data);
        });
      };

      brick.rows = function (cb) {
        let sqlStr = this.toString();
        client.query(sqlStr, (err, data) => {
          cb(err, data);
        });
      };

      return brick;
    }
  });

  return client
}

let Select = SqlBricks.select;

Select.prototype.limit = function (val) {
  this._limit = val;
  return this;
};

Select.prototype.offset = function (val) {
  this._offset = val;
  return this;
};

Select.defineClause(
  'limit',
  '{{#ifNotNull _limit}}LIMIT {{_limit}}{{/ifNotNull}}',
  { after: 'orderBy' }
);

Select.defineClause(
  'offset',
  '{{#ifNotNull _offset}}OFFSET {{_offset}}{{/ifNotNull}}',
  { after: 'limit' }
);

SqlBricks._autoQuoteChar = '`';
