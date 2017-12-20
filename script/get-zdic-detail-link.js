'use strict'

// first append jquery
var el = document.createElement('script')
el.src = 'http://demo.training.testbrother.net/js/jquery.min.js?_1512011634_'

document.body.appendChild(el)

// submit and get next valid word from my own server
var getNext = (params, cb) => {
  $.ajax({
    type: 'post',
    data: params,
    url: 'http://local.vividict.cn/zdic-link/next',
  }).done((res) => {
    if(res.code === 0) {
      cb(res.data)
    } else {
      cb(null, res.data)
    }
  }).fail((err) => {
    cb(err)
  });
}

// get detail link from zdic server
var getDetailLink = (wordName, cb) => {
  wordName = escape(wordName).toLocaleLowerCase()
  let url = 'http://www.zdic.net/sousuo/ac/?q=' + wordName + '&tp=tp2&lb=hp'

  $.ajax({
    type: 'get',
    url: url,
  }).done((res) => {
    let result = {}

    let linkMatch = res.match(/<li><a href="(.*)" class=/)
    if(linkMatch) result.zdicLink = linkMatch[1]

    let pinyinMatch = res.match(/'ef'>(.*)<\/span>/)
    if(pinyinMatch) result.pinyin = pinyinMatch[1]

    cb(null, result)
  }).fail((err) => {
    cb(err)
  });
}

// loop
var once = (params) => {
  getNext(params, (err, word) => {
    if(err) return console.log('get next err:', err)

    getDetailLink(word.name, (err, result) => {
      if(err) return console.log('get detail link err:', err)

      result.id = word.id
      console.log(word.name, 'OK')
      once(result)
    })
  })
}

once({})