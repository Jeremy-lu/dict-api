// code format 99xxx

const codeBase = require('./_config').codeBases.user
const generate = require('./helper').generate(codeBase);

module.exports= {
  not: {
    find() { return generate(1, '未找到商品信息'); }
  },

  invalid: {
    id() { return generate(2, 'id参数不合法'); }
  }
};
