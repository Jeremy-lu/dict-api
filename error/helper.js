'use strict';

let helper = {
  generate(codeBase) {
    return (code, text) => {
      return { code: codeBase + code, text };
    }
  }
};

module.exports = helper;
