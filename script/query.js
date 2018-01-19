'use strict';

require('../util/db/helper').initPool()

const model = require('../model/word.js')

let str = '{"evolveImgUrl":"http://www.vividict.com/UpFile/5/201005262112235739p.gif","desc":["欠，甲骨文","http://www.vividict.com/UserFiles/Image/==CA--renti==/--CA3--kou(zu)--/117qian/[1]jia(1).gif","像一个人","http://www.vividict.com/UserFiles/Image/==CA--renti==/--CA3--kou(zu)--/117qian/[1]jia(1)jian(1).gif","张大嘴巴","http://www.vividict.com/UserFiles/Image/==CA--renti==/--CA3--kou(zu)--/117qian/[1]jia(1)jian(2).gif","。篆文","http://www.vividict.com/UserFiles/Image/==CA--renti==/--CA3--kou(zu)--/117qian/[4]zhuan(1).gif","将甲骨文的","http://www.vividict.com/UserFiles/Image/==CA--renti==/--CA3--kou(zu)--/117qian/[1]jia(1)jian(2).gif","口（吹）写成气","http://www.vividict.com/UserFiles/Image/==CA--renti==/--CA3--kou(zu)--/117qian/[4]zhuan(1)jian(1).gif","。  "],"explain":[{"title":"造字本意","desc":["因倦怠而张口深深吸气和叹气"]},{"title":"说文解字","desc":["欠，張口气悟也。象气从人上出之形。凡欠之屬皆从欠"]}],"clueImgUrl":"http://www.vividict.com/UpFile/5/201006200617193532d.gif","detail":[{"title":"本义，动词：因倦怠而张口深深吸气和叹气","exampleList":[{"example":"欠，张口气悟也。","source":"《说文》"}]},{"title":"动词：因倦怠伸展身体","exampleList":[{"example":"君子欠伸。","source":"《仪礼 • 士相见礼》"},{"example":"惊觉欠伸。","source":"《虞初新志 • 秋声诗自序》"}]},{"title":"动词：缺乏，不够","exampleList":[{"example":"肾为欠。","source":"《素问 • 宣明五藏论》"},{"example":"欠为人师。","source":"唐 • 柳宗元《柳河东集》"},{"example":"甚妙，但似欠四字耳。","source":"陆游《老学庵笔记》"},{"example":"行路少年知不知，襄阳全欠旧来时。","source":"施肩吾《大堤新咏》"}]},{"title":"动词：亏负于人，付出不足","exampleList":[]}]}'

model.updateById(2265, {viviInfo: str}, (err, data) => {
  console.log(JSON.parse(data.viviInfo).explain)
})
