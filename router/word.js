'use strict';

const baseRouter = require('express').Router({ strict: true });
const router = require('../util/request-handler')(baseRouter);
const controller = require('../controller/word');
const paginator = require('../util/paginator');
const action = require('./helper').action(controller)

router.post('/', action('create'), (req, res, cb) => {
  cb([req.body])
}, { needLogin: false })

router.get('/search', action('search'), (req, res, cb) => {
  cb([req.query]);
});

router.get('/', action('getPaginatorList'), (req, res, cb) => {
  cb([req.query, paginator.getReqBody(req)]);
});

router.get('/all', action('getList'), (req, res, cb) => {
  cb([req.query]);
});

router.get('/:id', action('getById'), (req, res, cb) => {
  cb([req.params.id]);
});

router.put('/:id', action('update'), (req, res, cb) => {
  cb([req.params.id, req.body]);
});

router.delete('/:id', action('remove'), (req, res, cb) => {
  cb([req.params.id]);
});

module.exports = baseRouter;
