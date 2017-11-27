'use strict';

const _ = require('lodash')

module.exports = (schema) => {
  var sqlArr = [];

  for(let tableKey in schema) {
    let sqlStr = '';
    let tableObj = schema[tableKey];
    let columns = tableObj.columns;
    let indexs = tableObj.indexs;

    sqlStr += 'create table `' + tableObj.name + '` (\n';
    sqlStr += '  `id` int not null auto_increment,\n';

    for(let column of columns) {
      sqlStr += '  `' + column.name + '` ' + column.type;

      if(column.notNull) sqlStr += ' not null';
      if(column.default !== undefined) {
        if(typeof column.default === 'string') {
          sqlStr += " default '" + column.default + "'";
        } else {
          sqlStr += " default " + column.default;
        }
      }

      sqlStr += ',\n';
    }

    sqlStr += '  `createdAt` bigint,\n';
    sqlStr += '  `updatedAt` bigint,\n';
    sqlStr += '  primary key (`id`)\n'
    sqlStr += ')ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n';

    sqlStr += '\n';

    let indexStr = ''
    if(indexs) {
      for(let index of indexs) {
        if(!(index instanceof Array)) index = [index]

        let wrapper = index.map((item) => {
          return '`' + item.name + '`' + (item.indexLen ? '(' + item.indexLen + ')' : '')
        }).join(', ')

        indexStr = 'create index `' + _.map(index, 'name').join('_') + '` on `' + tableObj.name + '` (' + wrapper + ') using btree;\n\n'
      }
    }

    sqlArr.push(sqlStr);
    if(indexStr) sqlArr.push(indexStr)
  }

  return sqlArr;
}
