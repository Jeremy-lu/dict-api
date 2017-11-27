'use strict'

const helper = require('./tool/helper')
const reqClient = helper.reqClient
const async = require('async')
const _ = require('lodash')
const should = helper.should

let userInfo = {
  name: '鲁新建',
  mobile: '13333333333',
  password: '123456',
  sex: 1,
  profession: 'developer',
  address: 'beijing'
};

describe('user', () => {
  beforeEach((done) => {
    async.applyEach([
      (done) => helper.clearTables('user', done),
    ], done)
  });

  it('should create new user on /users post', (done) => {
    reqClient.post('/users')
    .send(userInfo)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.data.should.be.a('object');
      res.body.data.should.not.have.property('password');
      res.body.data.should.have.property('name', userInfo.name);
      done();
    });
  });

  it('should get user on /users/:id get', (done) => {
    let id = 333
    let name = 'MyUniqueName'
    // first create one
    insertSingle({ id, name }, () => {
      // then request it
      reqClient.get(`/users/${id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('name', name);
        done();
      });
    });
  });

  it('should get one page user on /users get', (done) => {
    let insertNum = 33;
    let currPage = 2;
    let pageSize = 10;

    insertSingle(insertNum, () => {
      reqClient.get(`/users`)
      .query({ currPage, pageSize })
      .end((err, res) => {
        // console.log(res.body)
        res.should.have.status(200);
        res.body.paginator.should.be.a('object');
        res.body.paginator.should.have.property('total', insertNum);
        res.body.data.should.be.a('array');
        res.body.data.should.have.length(pageSize);
        done();
      });
    });
  });

  it('should update user on /users/:id put', (done) => {
    let id = 333
    let createInfo = { id, name: 'old user name', address: 'old address' };
    let updateInfo = { id, name: 'new user name', address: 'new address' };

    insertSingle(createInfo, () => {
      reqClient.put(`/users/${id}`)
      .send(updateInfo)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('name', updateInfo.name);
        res.body.data.should.have.property('address', updateInfo.address);
        done();
      });
    });
  });

  it('should delete user on /users/:id delete', (done) => {
    helper.insertSingle('user', (err, data) => {
      // delete it
      reqClient.delete(`/users/${data.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');

        // then request it again
        reqClient.get(`/users/${res.body.data.id}`)
        .end((err, res) => {
          res.should.have.status(200);
          should.equal(res.body.data, null);

          done();
        });
      });
    });
  });
});

function insertSingle(num, attr, cb) {
  if(num instanceof Function) {
    cb = num;
    num = 1;
    attr = {};
  }

  if(num instanceof Object) {
    cb = attr;
    attr = num;
    num = 1;
  }

  if(attr instanceof Function) {
    cb = attr;
    attr = {};
  }

  let userInfoList = []
  let baseInfoList = []

  let userInfo = _.pick(attr, ['id', 'name', 'mobile', 'password'])
  let baseInfo = _.pick(attr, ['id', 'sex', 'profession', 'address'])

  for(var i=0; i<num; i++) {
    let id = 333 + i
    userInfoList.push(Object.assign({}, {id}, userInfo))
    baseInfoList.push(Object.assign({}, {id}, baseInfo))
  }

  async.applyEach([
    (done) => helper.insertMulti('user', userInfoList, done),
    (done) => helper.insertMulti('userBase', baseInfoList, done),
  ], (err) => {
    cb(err)
  })
}

