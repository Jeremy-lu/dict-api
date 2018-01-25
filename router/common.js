'use strict';

const baseRouter = require('express').Router({ strict: true });
const router = require('../util/request-handler')(baseRouter);
const controller = require('../controller/common');
const action = require('./helper').action(controller)

router.post('/merge-image', action('mergeImage'), (req, res, cb) => {
  cb([req.body]);
});

module.exports = baseRouter;
