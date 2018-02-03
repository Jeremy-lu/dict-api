'use strict'

const mergeImages = require('merge-images')
const Canvas = require('canvas');
const fs = require('fs')
const _ = require('lodash')
const helper = require('../util/helper')
const syncHelper = require('../util/sync-helper')

module.exports = {
  mergeImage(params, cb) {
    let width = 385
    let margin = 50

    let urlList = params.urlList

    // first, download images
    syncHelper.downloadImages(urlList, (err, result) => {
      if(err) return cb(err)

      // then generate source info
      let imgList = urlList.map((url, index) => {
        return {
          src: _.find(result, { url: url }).filePath,
          x: width * index + margin,
          y: 0
        }
      })

      // add background image
      imgList.unshift({ src: '/data/dict/merge/bg.jpg', x: 0, y: 0 })

      // last, merge
      let options = { width: width*urlList.length + margin*2, height: width, format: 'image/png', Canvas: Canvas }
      mergeImages(imgList, options).then((base64) => {
        base64 = base64.split(';base64,').pop();

        let relaPath = `merge/${helper.generateUniqStr(16)}.png`
        fs.writeFileSync(`/data/dict/${relaPath}`, base64, 'base64')

        let url = `https://static.vividict.cn/${relaPath}`
        // let url = `file:///data/dict/${relaPath}`

        // callback with merged image url
        cb(null, url)
      })
    })
  }
}
