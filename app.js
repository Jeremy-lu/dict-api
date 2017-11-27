'use strict'

const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(cookieParser());

// set cross domain
var whitelist = [
  'http://localhost:8080',
];
var corsOptions = {
  origin(origin, callback) {
    let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
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


app.use(require('./util/error-handler'));

require('./util/db/helper').initPool()

module.exports = app
