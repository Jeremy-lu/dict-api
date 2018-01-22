'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')
const SqlBricks = require('sql-bricks')

// let nameList = ['哈','杏','斌','刘','婷','姜','仆','奸','廓','据','烝','柜','希','博','冲','录','蒸','面','闲','尗','雕','斗','里','荡','夸','只','折','巩','拓','犁','升','厘','与','宁','洒','她','免','于','发','向','凭','趾','洼','几','会','睿','号','借','冑','范','干','亘','噩','术','沈','筑','医','觅','朴','证','歬','饥','价','辟','谷','酗','系','壘','笞','嬉','舍','著','考','鹊','云','胄','从','着','气','圣','荐','广','这','志','置','邮','札','丰','胜','征','愿','并','御','异','启','狈','丑','合','仇','飘','听','后','壬','现','获','采','致','机','咸','董','吃','复','凶','爯','历','太','制','蒙','坏','称','佐','郁','哈','刘','婷','姜','仆','奸','廓','烝','柜','希','博','录','蒸','面','闲','尗','斗','里','荡','夸','只','折','巩','拓','犁','厘','与','宁','洒','免','于','发','向','凭','洼','几','会','睿','号','借','亘','噩','沈','筑','医','觅','朴','证','歬','饥','价','辟','谷','壘','笞','舍','著','考','鹊','云','胄','从','着','气','圣','荐','广','这','志','置','邮','丰','胜','征','并','御','异','狈','丑','仇','飘','听','后','壬','现','获','采','致','机','咸','凶','爯','历','太','蒙','坏','称','郁']

model.update({ name: '斌' }, { descr: '古文份。今論語作彬。古文也。从彡林。彡者、毛飾畫文也。飾畫者、拭而畫之也。从彡、與彫彰同意。林者、从焚省聲。猶彫从彡、周聲也。按彬份字古或借豳字爲之。如上林之玢豳文鱗是也。或借邠字爲之。如太玄斐如邠如是也。俗份作斌。取文武相半意。潘岳藉田賦之頒斌。卽上林賦之玢豳。' }, (err, data) => {
  console.log(err, data)
})
