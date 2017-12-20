'use strict'

const request = require('request')
const cheerio = require('cheerio')
const Crawler = require('crawler')
let c = new Crawler()

module.exports = {
  getWordList(cb) {
    c.queue([{
      uri: 'http://www.vividict.com/WordList.html',
      retries: 3,
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
  },

  getXiaoInfo(word, cb) {
    let url = 'http://xiaoxue.iis.sinica.edu.tw/yanbian/PageResult/PageResult'
    let formData = {
      'ZiOrder': '',
      'EudcFontChar': word.name,
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
      let imgList = []

      let resultCountMatch = body.match(/共搜尋到(\d+)字/)
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
      // let order = -1
      tdElMatch.forEach((tdEl) => {
        let urlMatch = tdEl.match(/<img src="([^>\s]*)"[^>]*\/>/)
        let descMatch = tdEl.match(/<br \/>(.*)<br/)

        if(urlMatch) {
          imgList.push({
            url: 'http://xiaoxue.iis.sinica.edu.tw' + urlMatch[1],
            desc: descMatch ? descMatch[1] : '',
            // order: order += 1
          })
        }
      })

      // remove normal one
      imgList = imgList.slice(1)

      // append explain
      let explain = []
      if(shuo) {
        let arr = shuo.split('：')
        explain.push({ title: '说文解字', desc: arr[1] })
      }
      if(otherExplain) {
        let arr = otherExplain.split('：')
        explain.push({ title: arr[0], desc: arr[1] })
      }

      cb(err, { imgList: imgList, explain: explain })
    })
  },

  getViviInfo(word, cb) {
    let uri = 'http://www.vividict.com/WordInfo.aspx?id=' + word.viviId

    c.queue([{
      uri: uri,
      retries: 3,
      retryTimeout: 10000,
      callback: (err, res, done) => {
        if(err) return cb(err)

        let $ = res.$

        // format img src: use absolute path
        let imgList = $('img')
        for(let i=0; i<imgList.length; i++) {
          let img = imgList[i]
          let src = $(img).attr('src')

          if(src.indexOf('http://') === -1) {
            if(src.indexOf('/') !== 0) {
              src = '/' + src
            }

            $(img).attr('src', 'http://www.vividict.com' + src)
          }
        }

        // remove all hardcode style
        let elList = $('*')
        for(let i=0; i<elList.length; i++) {
          let el = $(elList[i])
          el.attr('style', '')
          el.attr('color', '')
          el.attr('face', '')
        }

        let explain = $('#contant_3 .contant').html()
        let detail = $('#contant_5 .contant').html()

        let explainFormatResult = this._formatExplain(explain)

        let viviInfo = {
          evolveImgUrl: $('#contant_2 img').attr('src'),
          desc: explainFormatResult.desc,
          explain: explainFormatResult.explain,
          clueImgUrl: $('#contant_4 img').attr('src'),
          detail: this._formatDetail(detail),
        }

        done()
        cb(null, viviInfo)
      }
    }])
  },

  getUncleInfo(word, cb) {
    let uri = 'http://www.chineseetymology.org/CharacterEtymology.aspx?submitButton1=Etymology&characterInput=' + encodeURIComponent(word.name)

    c.queue([{
      uri: uri,
      retries: 3,
      retryTimeout: 15000,
      callback: (err, res, done) => {
        if(err) return cb(err)

        let $ = res.$

        let result = [
          { title: '说文解字', id: 'SealImages' },
          { title: '六书通', id: 'LstImages' },
          { title: '金文编', id: 'BronzeImages' },
          { title: '甲骨文编', id: 'OracleImages' },
        ]

        for(let item of result) {
          let id = item.id
          delete item.id
          item.imgList = []

          // add absolute src url for image
          let imgElList = $(`#${id} img`)

          for(let i=0; i<imgElList.length; i++) {
            let imgEl = imgElList[i]
            let src = 'http://www.chineseetymology.org' + $(imgEl).attr('src')

            item.imgList.push(src)
          }
        }

        done()
        cb(null, result)
      }
    }])
  },

  getBishunInfo(word, cb) {
    c.queue([{
      uri: 'http://bishun.strokeorder.info/mandarin.php?q=' + encodeURI(word.name),
      retries: 3,
      retryTimeout: 10000,
      callback: (err, res, done) => {
        if(err) return cb(err)

        let match = res.body.match(/<img src="(.*\.gif)" alt="/)
        cb(null, { dynamicWrite: match ? match[1] : null })

        done()
      }
    }])
  },

  _formatExplain(text) {
    text = unescape(text.replace(/&#x/g, '%u').replace(/;/g, '').replace(/%uA0/g, ' ')).replace('\r\n', '')
    text = text.replace(/\s+/g, ' ')
    text = text.replace(/\r\n/g, '')

    // 为里面的图片标签增加特殊标识符，以便后期重新整理
    text = text.replace(/<img[^>]*src=\"([^\"]*)\"[^>]*>/g, '<span>￥$1￥</span>')

    // 只保留text内容，这样就可以清除原本杂乱无章的标签，之后会重新整理html内容
    let $ = cheerio.load(text)
    text = $($('div')[0]).text()

    // 把图片替换回去
    text = text.replace(/￥([^￥]*)￥/g, '<img src="$1" />')

    // 去掉白话版《说文解字》
    text = text.replace(/-{5}/g, '')
    text = text.split(/附*\s*白话版.*解字》/)[0]

    // 提取出造字本意
    let origin = null
    let originMatch = text.match(/造字本义：([^。]*。)/)
    if(originMatch) origin = originMatch[1]

    // 移除解说内容中的造字本意
    text = text.replace(/造字本义：[^。]*。/g, '')

    // 提取出解说内容已经文言文版《说文解字》
    let arr = text.split(/附[^\/-=。]+》：/)
    let content = arr[0].trim()
    let shuowen = arr[1] ? arr[1].trim() : ''

    return {
      desc: this._formatRichText(content),
      explain: [
        { title: '造字本意', desc: this._formatRichText(origin) },
        { title: '说文解字', desc: this._formatRichText(shuowen) },
      ]
    }
  },

  _formatDetail(text) {
    text = unescape(text.replace(/&#x/g, '%u').replace(/;/g, '').replace(/%uA0/g, ' '))

    let partList = text.split(/①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|⑪|⑫|⑬|⑭|⑮/)

    let result = []

    // 梳理 每一条词汇解释
    partList.forEach((part) => {
      let obj = {}

      // 只保留text内容，这样就可以清除原本杂乱无章的标签，之后会重新整理html内容
      let $ = cheerio.load(`<div>${part}</div>`)
      part = $($('div')[0]).text().trim()

      if(!part) return

      let lineList = part.split('\n')
      let titleLine = lineList.shift()

      obj.title = titleLine.split('。')[0].trim()
      obj.exampleList = []

      // 整理每一个示例
      lineList.forEach((item) => {
        if(!item || !item.trim() || item.indexOf('—') === -1) return

        let arr = item.split(/—+/)
        let example = arr[0].trim()
        let source = arr[1].trim()

        obj.exampleList.push({ example, source })
      })

      result.push(obj)
    })

    return result
  },

  _formatRichText(text) {
    let result = []

    let once = (text) => {
      let index = text.indexOf('>')

      let currPart = text.slice(0, index)
      let nextPart = index === -1 ? null : text.slice(index + 1)

      let splitArr = currPart.split(/</)
      let textStr = splitArr[0]
      let imgStr = splitArr[1]

      if(textStr) result.push(textStr)
      if(imgStr) result.push(imgStr.match(/src="(.*)"/)[1])

      if(nextPart) once(nextPart)
    }

    if(text) once(text)

    return result
  }
}

// module.exports.getViviInfo({ name: '动', viviId: '1055' }, (err, result) => {
//   console.log(err, result.explain)
// })
