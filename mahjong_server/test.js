// var dhmj = require("./majiang_server/gamemgr_dhmj");
// var sjmmj = require("./majiang_server/gamemgr_sjmmj");
// var tdh = require("./majiang_server/gamemgr_tdh");
//
// var consoleHolds = function (seatData) {
//     var hds = ["1筒","2筒","3筒","4筒","5筒","6筒","7筒","8筒","9筒",
//         "1条","2条","3条","4条","5条","6条","7条","8条","9条",
//         "1万","2万","3万","4万","5万","6万","7万","8万","9万",
//         "中","发","白","东","西","南","北","春","夏","秋","冬","梅","兰","竹","菊"];
//     var holds = seatData.holds;
//     var inZH = [].concat(holds);
//     inZH.sort(function(a,b){
//         return parseInt(a-b);
//     });
//     for (var i = 0; i < inZH.length ; i++) {
//         inZH[i] = hds[inZH[i]];
//     }
//     console.log("手牌为：" + inZH.join("、"));
//     return;
// };
//
// var consoleRES = function (game) {
//     for (var i = 0 ; i < 4 ; i++ ) {
//         var sd = game.gameSeats[i];
//         console.log("--------------------------------------------------------");
//         console.log("玩家"+i);
//         consoleHolds(sd);
//         // consoleHuas(sd);
//         // consoleChi(sd);
//         // consolePeng(sd);
//         console.log("台数："+sd.tai);
//         console.log("丝数："+sd.si);
//         console.log("胡数："+sd.fan);
//         console.log("分数："+sd.score);
//     }
// };
//
// //Jonathan 新增读取样本，用于测试场景重现
// var game = '{"conf":{"type":"sjmmj","hongzhongdanghua":true,"koufei":0,"quanshu":0,"jiesuan":2,"maxGames":8,"baseScore":20,"maxFan":10000,"creator":2},"roomInfo":{"uuid":"1493188565768609636","id":"609636","numOfGames":6,"fengxiang":1,"createTime":1493188566,"beginButton":1,"nextButton":2,"seats":[{"userId":2,"score":130,"name":"东方雀圣","ready":true,"seatIndex":0,"numZiMo":0,"numJiePao":2,"numDianPao":2,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"},{"userId":9,"score":-190,"name":"端木好运","ready":true,"seatIndex":1,"numZiMo":0,"numJiePao":0,"numDianPao":1,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"},{"userId":4,"score":140,"name":"东郭好运","ready":true,"seatIndex":2,"numZiMo":0,"numJiePao":2,"numDianPao":1,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"},{"userId":3,"score":-80,"name":"上官赌圣","ready":true,"seatIndex":3,"numZiMo":0,"numJiePao":1,"numDianPao":1,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"}],"ifPayed":true,"conf":{"type":"sjmmj","hongzhongdanghua":true,"koufei":0,"quanshu":0,"jiesuan":2,"maxGames":8,"baseScore":20,"maxFan":10000,"creator":2},"gameMgr":{}},"gameIndex":6,"button":2,"mahjongs":[14,2,29,3,32,8,39,9,16,26,10,32,31,29,13,17,23,0,10,10,20,5,11,3,3,2,5,28,23,31,30,12,33,23,3,41,33,4,12,11,0,8,30,7,26,32,13,23,33,29,1,21,1,16,27,25,27,22,9,13,18,35,15,9,25,28,14,19,16,6,4,0,5,11,11,27,22,17,5,12,7,34,2,24,25,19,18,20,25,8,15,30,4,19,31,21,6,2,18,28,29,18,33,6,20,7,40,1,10,22,16,32,24,14,4,21,27,37,15,14,8,12,22,21,17,36,20,19,26,24,31,15,26,9,7,30,28,6,24,38,1,17,13,0],"currentIndex":71,"gameSeats":[{"game":null,"seatIndex":0,"userId":2,"holds":[10,30,12,30,13,9,14,11],"folds":[25,5],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[[1,3,2],[10,11,9]],"huas":[39,27,27],"que":-1,"ifJustGanged":-17,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":1,"11":1,"12":1,"13":1,"14":1,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":2,"31":0,"32":0,"33":0,"39":0},"tingMap":{"11":{"pattern":"normal","fan":0}},"pattern":"normal","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":true,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":true,"iszimo":false,"isGangHu":false,"actions":[{"type":"hu","targets":[1],"iszimo":false}],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"isHaiDiHu":false},{"game":null,"seatIndex":1,"userId":9,"holds":[3,9,10,3,12,7,13,18,19,4],"folds":[32,28,13],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[[21,23,22]],"huas":[41],"que":-1,"ifJustGanged":-17,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":2,"4":1,"5":0,"6":0,"7":1,"8":0,"9":1,"10":1,"11":0,"12":1,"13":1,"14":0,"15":0,"16":0,"17":0,"18":1,"19":1,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"41":0},"tingMap":{},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":true},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[{"type":"fangpao","targets":[0]}],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":2,"userId":4,"holds":[14,16,23,20,3,23,0,26,33,1,15,25,16],"folds":[32,33,31,17,33],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[],"huas":[35],"que":-1,"ifJustGanged":-18,"huanpais":null,"countMap":{"0":1,"1":1,"2":0,"3":1,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":1,"15":1,"16":2,"17":0,"18":0,"19":0,"20":1,"21":0,"22":0,"23":2,"24":0,"25":1,"26":1,"28":0,"29":0,"30":0,"31":0,"32":0,"33":1},"tingMap":{},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":3,"userId":3,"holds":[8,0,5,2,31,23,4,8,16,6],"folds":[32,26,28],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[29],"chis":[],"huas":[],"que":-1,"ifJustGanged":-18,"huanpais":null,"countMap":{"0":1,"1":0,"2":1,"3":0,"4":1,"5":1,"6":1,"7":0,"8":2,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":1,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":1,"32":0,"33":0},"tingMap":{},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0}],"numOfQue":0,"turn":1,"chuPai":11,"state":"playing","firstHupai":0,"yipaoduoxiang":-1,"fangpaoshumu":1,"actionList":[2,1,32,3,2,16,3,1,32,0,2,22,0,1,29,3,3,29,3,1,26,0,2,9,0,1,25,1,2,18,1,1,32,2,2,15,2,1,33,3,2,9,3,1,2,0,7,2,0,1,22,1,7,22,1,1,28,2,2,25,2,1,31,3,2,28,3,1,28,0,2,14,0,1,5,1,2,19,1,1,17,2,2,16,2,1,33,3,2,6,3,1,9,0,7,9,0,1,13,1,2,4,1,1,11,0,5,11],"hupaiList":[0],"chupaiCnt":18,"fangpaoindex":1,"leftlength":126,"baseInfoJson":null,"lastHuPaiSeat":0,"qiangGangContext":null} ';
// game = JSON.parse(game);
// switch(game.conf.type) {
//     case "sjmmj":sjmmj.calculateRes(game);break;
//     case "dhmj":dhmj.calculateRes(game);break;
//     case "tdh":tdh.calculateRes(game);break;
// }
// consoleRES(game);
// return;
var crypto = require('./utils/crypto');
var name = undefined;
if(!name) name = "东方雀圣";
name = crypto.toBase64(name);
console.log(name);