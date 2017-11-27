'use strict';

module.exports = {
  mobile(mobile) {
    let reg = /1\d{10}/;

    return reg.test(mobile);
  },

  password(password) {
    if(!password) return false;

    if(password.length < 6) return false;

    return true;
  },

  email(email) {
    let reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    return reg.test(email);
  }
};
