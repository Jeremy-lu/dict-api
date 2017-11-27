'use strict'

module.exports = (router) => {
  let handler = (type, path, dealer, getParamsFunc, options) => {
    options = options || {}

    router[type](path, (req, res, next) => {
      let mainProcess = () => {
        let cbFunc = (err, data, paginator) => {
          if(err) return next(err)

          if(typeof data === 'undefined') {
            data = null
          }

          if(paginator) {
            res.send({ code: 1, paginator, data })
          } else {
            res.send({ code: 1, data })
          }
        }

        getParamsFunc(req, res, (params) => {
          if(params) {
            params.push(cbFunc, req, res)
            dealer.apply(null, params)
          } else {
            dealer(cbFunc, req, res)
          }
        })
      }

      mainProcess()
    })
  }

  return {
    get(path, dealer, getParamsFunc, options) { handler('get', path, dealer, getParamsFunc, options) },
    post(path, dealer, getParamsFunc, options) { handler('post', path, dealer, getParamsFunc, options) },
    put(path, dealer, getParamsFunc, options) { handler('put', path, dealer, getParamsFunc, options) },
    delete(path, dealer, getParamsFunc, options) { handler('delete', path, dealer, getParamsFunc, options) },
  }
}
