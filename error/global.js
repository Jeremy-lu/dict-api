'use strict';

// code format 99xxx
const codeBase = require('./_config').codeBases.global
const generate = require('./helper').generate(codeBase);

module.exports= {
  should: {
    be: {
      number(param) { return generate(1, `参数${param}应为number类型`); },
      array(param) { return generate(2, `参数${param}应为array类型`); },
      boolean(param) { return generate(3, `参数${param}应为boolean类型`); },
      object(param) { return generate(4, `参数${param}应为object类型`); },
    }
  },

  not: {
    login() { return generate(5, '尚未登录'); },
  },

  permission: {
    denied() { return generate(6, '无此权限'); }
  }
};
