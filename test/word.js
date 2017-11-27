'use strict'

const helper = require('./tool/helper')
const reqClient = helper.reqClient
const should = helper.should
const async = require('async')

let wordInfo = {
  name: '鲁新建'
};

describe('word', () => {
  beforeEach((done) => {
    helper.clearTables('word', done);
  });

  it('should create new word on /words post', (done) => {
    reqClient.post('/words')
    .send(wordInfo)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.data.should.be.a('object');
      res.body.data.should.have.property('name', wordInfo.name);
      done();
    });
  });

  it('should get word on /words/:id get', (done) => {
    let name = 'MyUniqueName';
    // first create one
    helper.insertSingle('word', { name }, (err, data) => {
      // then request it
      reqClient.get(`/words/${data.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('name', name);
        done();
      });
    });
  });

  it('should get all words on /words/all get', (done) => {
    let insertNum = 20;

    helper.insertSingle('word', insertNum, () => {
      reqClient.get(`/words/all`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('array');
        res.body.data.should.have.length(insertNum);
        done();
      });
    });
  });

  it('should support fuzzy search on /words/all get', (done) => {
    let searchStr = 'foo';

    let excludeInfo = { name: `not include searchStr` };
    let includeInfo = { name: `name include ${searchStr}` };

    let excludeNum = 3;
    let includeNum = 5;

    async.applyEach([
      (done) => helper.insertSingle('word', excludeNum, excludeInfo, done),
      (done) => helper.insertSingle('word', includeNum, includeInfo, done),
    ], () => {
      reqClient.get(`/words/all`)
      .query({ searchStr })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('array');
        res.body.data.should.have.length(includeNum);
        done();
      });
    });
  });

  it('should get one page word on /words get', (done) => {
    let insertNum = 33;
    let currPage = 2;
    let pageSize = 10;

    helper.insertSingle('word', insertNum, () => {
      reqClient.get(`/words`)
      .query({ currPage, pageSize })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.paginator.should.be.a('object');
        res.body.paginator.should.have.property('total', insertNum);
        res.body.data.should.be.a('array');
        res.body.data.should.have.length(pageSize);
        done();
      });
    });
  });

  it('should update word on /words/:id put', (done) => {
    let newInfo = { name: 'new word name' };

    helper.insertSingle('word', (err, data) => {
      reqClient.put(`/words/${data.id}`)
      .send(newInfo)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('name', newInfo.name);
        done();
      });
    });
  });

  it('should delete word on /words/:id delete', (done) => {
    helper.insertSingle('word', (err, data) => {
      // delete it
      reqClient.delete(`/words/${data.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');

        // then request it again
        reqClient.get(`/words/${res.body.data.id}`)
        .end((err, res) => {
          res.should.have.status(200);
          should.equal(res.body.data, null);

          done();
        });
      });
    });
  });
});
