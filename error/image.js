// code format 99xxx

const codeBase = require('./_config').codeBases.user
const generate = require('./helper').generate(codeBase);

module.exports= {
  not: {
    find() { return generate(1, '未找到相应图片'); }
  },
};
