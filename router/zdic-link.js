'use strict';

const baseRouter = require('express').Router({ strict: true });
const router = require('../util/request-handler')(baseRouter);
const controller = require('../controller/sync/zdic-link');
const action = require('./helper').action(controller)

router.post('/next', action('getNext'), (req, res, cb) => {
  cb([req.body])
}, { needLogin: false })

module.exports = baseRouter;
