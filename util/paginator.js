'use strict'

module.exports = {
  getReqBody(req, options) {
    let pageSize = req.query.pageSize
    let currPage = req.query.currPage
    if(options) {
      pageSize = pageSize ||  options.pageSize
      currPage = currPage ||  options.currPage
    }

    let reg = /\d+/

    if(pageSize && reg.test(pageSize) && pageSize > 0) {
      pageSize = parseInt(pageSize)
    } else {
      pageSize = 10
    }

    if(currPage && reg.test(currPage) && currPage > 0) {
      currPage = parseInt(currPage)
    } else {
      currPage = 1
    }

    delete req.query.pageSize
    delete req.query.currPage

    return { pageSize, currPage }
  },

  createResBody(reqBody, total) {
    let remain = total - reqBody.pageSize * (reqBody.currPage)
    if(remain < 0) remain = 0
    return {
      total,
      pageSize: reqBody.pageSize,
      currPage: reqBody.currPage,
      remain
    }
  }
}
