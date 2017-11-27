'use strict'

const crypto = require('crypto')

module.exports = {
  encrypt(str) {
    let hash = crypto.createHash('md5')
    hash.update(str)
    return hash.digest('hex')
  },

  generateUniqStr(length) {
    let str = ''
    length = length || 32
    while (length--) {
      str += (Math.random() * 16 | 0) % 2 ? (Math.random() * 16 | 0).toString(16)
        : (Math.random() * 16 | 0).toString(16).toUpperCase()
    }
    return str.toLowerCase()
  },

  getDatetimp() {
    // return new Date().toISOString().slice(0, 19).replace('T', ' ')
    return new Date().getTime()
  },
}
