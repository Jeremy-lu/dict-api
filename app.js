'use strict'

const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const uncleSyncController = require('./controller/sync/uncle')
const viviSyncController = require('./controller/sync/vivi')
const xiaoSyncController = require('./controller/sync/xiao')
const zdicLinkSyncController = require('./controller/sync/zdic-link')
const zdicSyncController = require('./controller/sync/zdic')
const zdicCalligraphySyncController = require('./controller/sync/zdic-calligraphy')
const bishunSyncController = require('./controller/sync/bishun')

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(cookieParser());

// set cross domain
// var whitelist = [
//   'http://localhost:8080',
//   'http://test.com',
//   'http://www.zdic.net',
// ];
var corsOptions = {
  origin: '*',
  // origin(origin, callback) {
  //   let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
  //   callback(null, originIsWhitelisted);
  // },
  credentials: true,
  methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-Requested-With', 'Content-Type']
};
app.use(cors(corsOptions));

// set logger
if((process.env.FRAMEWORK_EXPRESS_ENV !== 'test') && (app.settings.env === 'development')) {
  app.use(logger('dev'));
}

// ping
app.get('/ping', (req, res) => {
  res.send('pong');
})

// config router
app.use('/users', require('./router/user'));
app.use('/words', require('./router/word'));
app.use('/common', require('./router/common'));
app.use('/zdic-link', require('./router/zdic-link'));


app.use(require('./util/error-handler'));

require('./util/db/helper').initPool()

// first sync basic info
// viviSyncController.start(true)
// zdicSyncController.start(true)
// uncleSyncController.start(true)
// xiaoSyncController.start(true)
// bishunSyncController.start(true)

// then sync zdict link manually
// zdicLinkSyncController.start(true)

// then sync calligraphy
// zdicCalligraphySyncController.start(true)

module.exports = { app, server };
