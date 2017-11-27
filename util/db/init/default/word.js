'use strict'

module.exports = (client, cb) => {

  let words = '说文解字'

  let data = words.split('').map((word) => {
    return { name: word }
  })

  client.insert('word', data).run(cb)
}
