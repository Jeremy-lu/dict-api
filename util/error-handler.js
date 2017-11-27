'use strict';

module.exports = (err, req, res, next) => {
  if(typeof err === 'string') {
    err = { text: err }
  } else if(err.stack) {
    console.log(err.stack);
  } else {
    console.log(err);
  }

  let newErr;

  if(err instanceof Error) {
    res.send({ code: 0, data: '服务器端未知错误，请联系管理员。' });
  } else {
    res.send({ code: 0, data: err.text});
  }

  next(newErr);
};
