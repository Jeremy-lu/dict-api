'use strict'

require('../util/db/helper').initPool()

let wordModel = require('../model/word.js')
const Crawler = require('crawler')

let c = new Crawler()

let getWordList = (cb) => {
  c.queue([{
    uri: 'http://www.vividict.com/WordList.html',
    retries: 1,
    retryTimeout: 5000,
    callback: (err, res, done) => {
      if(err) return cb(err)

      let wordList = []
      let $ = res.$

      let elList = $('.zu_expain a')

      for(let i=0; i<elList.length; i++) {
        let el = elList[i]

        let name = null
        if(el.children && el.children[0]) {
          name = el.children[0].data
        }

        let id = el.attribs.href.split('id=')[1]

        wordList.push({ viviId: id, name: name })
      }

      cb(null, wordList)
      done()
    }
  }])
}

getWordList((err, wordList) => {
  // wordList = wordList.slice(0, 3)
  wordModel.createAll(wordList, (err) => {
    console.log('finished')
    console.log(err)
  })
})
