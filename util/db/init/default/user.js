'use strict'

module.exports = (client, cb) => {
  let data = [
    {
      id: 1,
      name: 'luxinjian',
      mobile: '15910592793',
      password: '123456',
      sex: 1,
      profession: 1,
      address: 'beijing',
    }
  ]

  client.insert('user', data).run(cb)
}
