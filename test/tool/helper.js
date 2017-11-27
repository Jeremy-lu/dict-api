'use strict';

process.env.FRAMEWORK_EXPRESS_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const SqlBricks = require('sql-bricks');
chai.use(chaiHttp);
const app = require('../../app');
const dbHelper = require('../../util/db/helper');
const defaultAttrs = require('./default-attrs');

dbHelper.initPool()

let helper = {
  chai,
  should: chai.should(),
  dbHelper: dbHelper,
  reqClient: chai.request(app),
  reqAgent: chai.request.agent(app),

  clearTables(tables, cb) {
    if(!(tables instanceof Array)) tables = [tables];
    let count = tables.length;
    let returned = false;

    this.dbHelper.getClient((err, client) => {
      if(err) return cb(err)

      for(let table of tables) {
        client.delete().from(table).run((err) => {
          if(returned) return;

          if(err) {
            returned = true;
            return cb(err);
          }

          count --;
          if(count <= 0) {
            returned = true;
            cb();

            client.release()
          }
        });
      }
    })
  },

  insertSingle(table, num, attr, cb) {
    if(num instanceof Function) {
      cb = num;
      num = 1;
      attr = {};
    }

    if(num instanceof Object) {
      cb = attr;
      attr = num;
      num = 1;
    }

    if(attr instanceof Function) {
      cb = attr;
      attr = {};
    }

    let infoList = [];
    for(var i=0; i<num; i++) infoList.push(attr);

    this.insertMulti(table, infoList, (err, data) => {
      cb(err, data && num === 1 ? data[0] : data);
    });
  },

  insertMulti(table, infoList, cb) {
    let defaultAttr = defaultAttrs[table] || {};

    let currTime = new Date().getTime()

    infoList = infoList.map((attr) => {
      return Object.assign({
        createdAt: currTime,
        updatedAt: currTime,
      }, defaultAttr, attr);
    });

    // console.log(infoList[0])

    this.dbHelper.getClient((err, client) => {
      if(err) return cb(err)

      client.insert(table, infoList).rows((err, result) => {
        if(err) return cb(err);

        let minId = result.insertId;
        let maxId = result.insertId + result.affectedRows - 1;

        client.select().from(table).where(SqlBricks.between('id', minId, maxId)).rows((err, data) => {
          cb(err, data);

          client.release()
        });
      });
    });
  }
};

module.exports = helper;
