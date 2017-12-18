'use strict'

const request = require('request')
const cheerio = require('cheerio')
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
      let order = -1
      tdElMatch.forEach((tdEl) => {
        let urlMatch = tdEl.match(/<img src="([^>\s]*)"[^>]*\/>/)
        let descMatch = tdEl.match(/<br \/>(.*)<br/)

        if(urlMatch) {
          imgList.push({
            url: 'http://xiaoxue.iis.sinica.edu.tw' + urlMatch[1],
            desc: descMatch ? descMatch[1] : '',
            order: order += 1
          })
        }
      })

      // remove normal one
      imgList = imgList.slice(1)

      // append image list
      let imgListHtml = '<div class="img-list">\n'
      imgList.forEach((img) => {
        imgListHtml += '<div class="img-item">\n'
        imgListHtml += `<img src="${img.url}" />\n`
        imgListHtml += `<div class="desc">${img.desc}</div>\n`
        imgListHtml += '</div>\n'
      })
      imgListHtml += '</div>\n'

      // append explain
      let additionalHtml = '<div>\n'
      if(shuo) {
        let arr = shuo.split('：')
        additionalHtml += `<div class="shuowen"><span class="title">说文解字：</span>${arr[1]}</div>\n`
      }
      if(otherExplain) {
        let arr = otherExplain.split('：')
        additionalHtml += `<div class="origin"><span class="title">${arr[0]}：</span>${arr[1]}</div>\n`
      }

      additionalHtml += '</div>\n'

      cb(err, { imgList: escape(imgListHtml), additional: escape(additionalHtml) })
    })
  },

  getViviInfo(word, cb) {
    let uri = 'http://www.vividict.com/WordInfo.aspx?id=' + word.viviId

    c.queue([{
      uri: uri,
      retries: 1,
      retryTimeout: 5000,
      callback: (err, res, done) => {
        if(err) return cb(err)

        let $ = res.$

        // add absolute src url for image
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

        let viviInfo = {
          evolveImgUrl: $('#contant_2 img').attr('src'),
          explain: escape(this._formatExplain(word.name, explain)),
          clueImgUrl: $('#contant_4 img').attr('src'),
          detail: escape(this._formatDetail(word.name, detail)),
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
      retries: 1,
      retryTimeout: 5000,
      callback: (err, res, done) => {
        if(err) return cb(err)

        let $ = res.$

        let html = ''

        let map = {
          'seal': { title: '说文解字', id: 'SealImages' },
          'lst': { title: '六书通', id: 'LstImages' },
          'bronze': { title: '金文编', id: 'BronzeImages' },
          'oracle': { title: '甲骨文编', id: 'OracleImages' },
        }

        for(let key in map) {
          let value = map[key]

          html += `<div class="${key} part">\n`
          html += `<div class="title">${value.title}</div>\n`
          html += `<div class="img-list">\n`

          // add absolute src url for image
          let imgList = $(`#${value.id} img`)

          for(let i=0; i<imgList.length; i++) {
            let img = imgList[i]
            let src = 'http://www.chineseetymology.org' + $(img).attr('src')

            html += '<div class="img-item">\n'
            html += `<img src="${src}" />\n`
            html += '</div>\n'
          }

          html += '</div>\n</div>\n'
        }

        done()
        cb(null, { imgList: escape(html) })
      }
    }])
  },

  _formatExplain(originWord, text) {
    text = unescape(text.replace(/&#x/g, '%u').replace(/;/g, '').replace(/%uA0/g, ' '))

    // 为里面的图片标签增加特殊标识符，以便后期重新整理
    text = text.replace(/<img[^>]*src=\"([^\"]*)\"[^>]*>/g, '<span>￥$1￥</span>')

    // 只保留text内容，这样就可以清除原本杂乱无章的标签，之后会重新整理html内容
    let $ = cheerio.load(text)
    text = $($('div')[0]).text()

    // 去掉白话版《说文解字》
    text = text.replace(/-{5}/g, '')
    text = text.split(/附\s+白话版.*解字》/)[0]

    // 提取出造字本意
    let origin = null
    let originMatch = text.match(/造字本义：([^。]*。)/)
    if(originMatch) origin = originMatch[1]

    // 移除解说内容中的造字本意
    text = text.replace(/造字本义：[^。]*。/g, '')

    // 提取出解说内容已经文言文版《说文解字》
    let arr = text.split(/附\s+文言版.*解字》：/)
    let content = arr[0].trim()
    let shuowen = arr[1].trim()

    // 重新拼接解说模块的html内容
    let html = '<div>\n'
    html += `<div class="text">${content}</div>\n`
    html += '<div class="additional">\n'
    if(origin) {
      html += `<div class="origin"><span class="title">造字本意：</span>${origin}</div>\n`
    }
    html += `<div class="shuowen"><span class="title">说文解字：</span>${shuowen}</div>\n`
    html += '</div>\n'
    html += '</div>\n'

    // 把图片替换回去
    html = html.replace(/￥([^￥]*)￥/g, '<img src="$1" />')

    // console.log(html)
    return html
  },

  _formatDetail(originWord, text) {
    text = unescape(text.replace(/&#x/g, '%u').replace(/;/g, '').replace(/%uA0/g, ' '))

    let partList = text.split(/①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|⑪|⑫|⑬|⑭|⑮/)

    let html = '<div>\n'

    // 梳理 每一条词汇解释
    partList.forEach((part) => {
      // 只保留text内容，这样就可以清除原本杂乱无章的标签，之后会重新整理html内容
      let $ = cheerio.load(`<div>${part}</div>`)
      part = $($('div')[0]).text().trim()

      if(!part) return

      let lineList = part.split('\n')
      let titleLine = lineList.shift()

      html += '<div class="part">\n'

      html += `<div class="title">${titleLine.split('。')[0].trim()}</div>\n`
      html += '<div class="example">\n'

      // 整理每一个示例
      lineList.forEach((item) => {
        if(!item || !item.trim() || item.indexOf('—') === -1) return

        let arr = item.split(/—+/)
        let example = arr[0].trim()
        let source = arr[1].trim()

        example = example.replace(new RegExp(originWord, 'g'), `<span class="current">${originWord}</span>`)
        let joinLine = '<div class="join-line"></div>'
        html += `<div class="example-item">${example}${joinLine}${source}</div>\n`
      })

      html += '</div>\n'
      html += '</div>\n'
    })

    html += '</div>\n'

    return html
  }
}

// module.exports.getUncleInfo({ name: '字' }, (err, result) => {
//   console.log(err, result)
// })
