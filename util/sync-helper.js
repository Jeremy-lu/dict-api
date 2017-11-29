'use strict'

const request = require('request')
const Crawler = require('crawler')
let c = new Crawler()

module.exports = {
  getWordList(cb) {
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

          wordList.push({ viviId: id, name: name, status: 'sync' })
        }

        cb(null, wordList)
        done()
      }
    }])
  },

  getWordImageList(word, cb) {
    let url = 'http://xiaoxue.iis.sinica.edu.tw/yanbian/PageResult/PageResult'
    let formData = {
      'ZiOrder': '',
      'EudcFontChar': word,
      'ImageSize': 36,
      'X-Requested-With': 'XMLHttpRequest'
    }

    request.post({url, formData: formData}, (err, resp, body) => {
      if(err) return cb(err)

      body = body.replace(/<td/g, '<￥￥td')
      body = body.replace(/<dd/g, '<！！dd')

      let resultCount = 0
      let xiaoId = null
      let shuo = null
      let otherExplain = null
      let imageList = []

      let resultCountMatch = body.match(/共搜尋到(\d)字/)
      if(resultCountMatch) resultCount = resultCountMatch[1]

      if(resultCount === 0) return cb('not find')

      let xiaoIdMatch = body.match(/<span id="StartOrder">(\d+)<\/span>/)
      if(xiaoIdMatch) xiaoId = xiaoIdMatch[1]

      let ddElMatch = body.match(/！[^！]+！/g) || []
      ddElMatch.forEach((ddEl, index) => {
        let textMatch = ddEl.match(/>([^<>]*)</)
        if(textMatch) {
          if(index === 0) shuo = textMatch[1]
          if(index === 1) otherExplain = textMatch[1]
        }
      })

      let tdElMatch = body.match(/￥[^￥]+￥/g) || []
      let order = -1
      tdElMatch.forEach((tdEl) => {
        let urlMatch = tdEl.match(/<img src="([^>\s]*)"[^>]*\/>/)
        let descMatch = tdEl.match(/<br \/>(.*)<br/)

        if(urlMatch) {
          imageList.push({
            url: urlMatch[1],
            desc: descMatch ? descMatch[1] : '',
            order: order += 1
          })
        }
      })

      // remove normal one
      imageList = imageList.slice(1)

      cb(err, { xiaoId, shuo, otherExplain, imageList })
    })
  }
}
//
// module.exports.getWordImageList('苇', (err, result) => {
//   console.log(err, result)
// })
