'use strict'

const async = require('async')
const wordModel = require('../../model/word')

const dbHelper = require('../../util/db/helper')
dbHelper.initPool()

let total = 0
let dealedNum = 0
let finishedNum = 0
let perQueryNum = 100

wordModel.count({}, (err, count) => {
  total = count

  let params = {
    columns: ['id', 'viviInfo'],
    where: {descr: null},
    limit: perQueryNum
  }

  let once = () => {
    params.offset = dealedNum

    wordModel.find(params, (err, list) => {
      dealedNum += perQueryNum
      // console.log(list.length)
      if(!list.length) return console.log('finished')

      async.eachLimit(list, 3, (item, done) => {
        finishedNum += 1
        console.log(finishedNum + '/' + total)
        if(!item.viviInfo) return done()

        let descr = getDescr(item)

        if(!descr) return done()

        wordModel.updateById(item.id, { descr }, () => {
          done()
        })
      }, () => {
        once()
      })
    })
  }

  once()
})

function getDescr(item) {
  let viviInfo = {}

  try {
    viviInfo = JSON.parse(item.viviInfo)
  } catch(e) {
    console.log(item.viviInfo)
  }

  let explain = viviInfo.explain

  if(!explain) return null

  let descr = null

  explain.forEach((x) => {
    if(x.title === '说文解字') {
      let desc = x.desc
      if(!desc) return

      descr = desc.filter((y) => {
        return y.indexOf('http') === -1
      }).join('')
    }
  })

  // console.log(descr)
  return descr
}
