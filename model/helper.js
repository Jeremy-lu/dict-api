'use strict'

const dbHelper = require('../util/db/helper')

module.exports = {
  transQuery(mainFunc, mainCb) {
    dbHelper.getClient((err, client) => {
      if(!client) return mainCb('db client not ready')

      client.beginTransaction((err) => {
        if(err) return mainCb('begin transaction failed')

        mainFunc(client, (err) => {
          if(err) {
            client.rollback(() => {
              client.release()

              mainCb(err)
            })
          } else {
            client.commit((err) => {
              if(err) {
                client.rollback(() => {
                  client.release()

                  mainCb(err)
                })
              } else {
                client.release()

                mainCb(null)
              }
            })
          }
        })
      })
    })
  }
}

/*

// usage

let mainCb = (err) => {
  // all is finished
  // if got error, means this task failed
  // else, this task success
}

let mainFunc = (client, tranCb) => {
  // use client as normal
  // ...

  // when finished
  if(has error during using the client) {
    tranCb(err)
  } else {
    tranCb(null)
  }
}

getTransClient(mainFunc, mainCb)

*/
