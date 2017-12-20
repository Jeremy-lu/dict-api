'use strict'

const request = require('request')
const cheerio = require('cheerio')
const Crawler = require('crawler')
let c = new Crawler()

module.exports = {
  getZdicInfo(word, cb) {
    c.queue([{
      uri: 'http://www.zdic.net/z/16/js/52A8.htm',
      retries: 3,
      retryTimeout: 5000,
      callback: (err, res, done) => {
        if(err) return cb(err)

        let $ = res.$

        console.log(res.body)
        done()
      }
    }])
  }
}

module.exports.getZdicInfo({ name: '动' }, (err, result) => {
  console.log(err, result)
})
