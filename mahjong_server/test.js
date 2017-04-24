var dhmj = require("./majiang_server/gamemgr_dhmj");
var sjmmj = require("./majiang_server/gamemgr_sjmmj");
var tdh = require("./majiang_server/gamemgr_tdh");

var consoleHolds = function (seatData) {
    var hds = ["1筒","2筒","3筒","4筒","5筒","6筒","7筒","8筒","9筒",
        "1条","2条","3条","4条","5条","6条","7条","8条","9条",
        "1万","2万","3万","4万","5万","6万","7万","8万","9万",
        "中","发","白","东","西","南","北","春","夏","秋","冬","梅","兰","竹","菊"];
    var holds = seatData.holds;
    var inZH = [].concat(holds);
    inZH.sort(function(a,b){
        return parseInt(a-b);
    });
    for (var i = 0; i < inZH.length ; i++) {
        inZH[i] = hds[inZH[i]];
    }
    console.log("手牌为：" + inZH.join("、"));
    return;
};

var consoleRES = function (game) {
    for (var i = 0 ; i < 4 ; i++ ) {
        var sd = game.gameSeats[i];
        console.log("--------------------------------------------------------");
        console.log("玩家"+i);
        consoleHolds(sd);
        // consoleHuas(sd);
        // consoleChi(sd);
        // consolePeng(sd);
        console.log("台数："+sd.tai);
        // console.log("丝数："+sd.si);
        // console.log("胡数："+sd.fan);
        console.log("分数："+sd.score);
    }
};

//Jonathan 新增读取样本，用于测试场景重现
var game = '{"conf":{"type":"sjmmj","hongzhongdanghua":false,"koufei":0,"quanshu":1,"jiesuan":1,"maxGames":100,"baseScore":20,"maxFan":10000,"creator":20},"roomInfo":{"uuid":"1492926872537574689","id":"574689","numOfGames":4,"fengxiang":0,"createTime":1492926873,"beginButton":1,"nextButton":3,"seats":[{"userId":20,"score":-80,"name":"东阳赌侠","ready":true,"seatIndex":0,"numZiMo":0,"numJiePao":1,"numDianPao":1,"numAnGang":0,"numMingGang":1,"numChaJiao":0,"ip":"::ffff:115.209.65.23"},{"userId":21,"score":70,"name":"东方有钱","ready":true,"seatIndex":1,"numZiMo":1,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"},{"userId":23,"score":-110,"name":"东郭稳赢","ready":true,"seatIndex":2,"numZiMo":0,"numJiePao":0,"numDianPao":1,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"},{"userId":24,"score":120,"name":"上官好运","ready":true,"seatIndex":3,"numZiMo":0,"numJiePao":1,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"}],"ifPayed":true,"conf":{"type":"sjmmj","hongzhongdanghua":false,"koufei":0,"quanshu":1,"jiesuan":1,"maxGames":100,"baseScore":20,"maxFan":10000,"creator":20},"gameMgr":{}},"gameIndex":4,"button":3,"mahjongs":[18,23,27,29,2,4,15,11,8,1,22,29,24,30,4,14,20,3,25,0,12,14,11,2,23,7,4,0,33,10,17,17,22,3,25,21,10,5,39,26,32,31,6,26,20,21,31,9,29,24,12,14,2,16,16,21,28,33,19,41,27,23,17,13,15,0,10,19,19,0,31,13,32,32,6,34,28,24,7,25,30,5,25,12,29,5,9,22,1,24,18,17,27,1,5,33,9,37,3,13,15,13,30,26,16,6,16,4,22,12,15,40,11,14,36,9,20,8,18,21,38,7,19,20,8,26,8,3,23,1,28,11,18,33,6,31,7,30,2,35,32,27,28,10],"currentIndex":90,"gameSeats":[{"game":null,"seatIndex":0,"userId":20,"holds":[4,1,3,3,5,24,24],"folds":[31,30,7,21,32,30,12,22],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[19],"chis":[[13,14,12]],"huas":[],"que":-1,"ifJustGanged":-23,"huanpais":null,"countMap":{"0":0,"1":1,"2":0,"3":2,"4":1,"5":1,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":2,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"2":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":1,"userId":21,"holds":[27,25,11,4,17,25,16,27,15,5],"folds":[31,6,16,15,32,4,12,29,1],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[[21,22,23]],"huas":[39,41],"que":-1,"ifJustGanged":-7,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":1,"5":1,"6":0,"7":0,"8":0,"9":0,"10":0,"11":1,"12":0,"13":0,"14":0,"15":1,"16":1,"17":1,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":2,"26":0,"27":2,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"39":0},"tingMap":{},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[{"type":"fanggang","targets":[2]}],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":2,"userId":23,"holds":[14,26,14,6,7,25,5,24],"folds":[28,17,9,31,11],"angangs":[],"diangangs":[0],"wangangs":[],"pengs":[29],"chis":[],"huas":[],"que":-1,"ifJustGanged":-5,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":1,"6":1,"7":1,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":2,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":1,"25":1,"26":1,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"24":{"pattern":"normal","fan":0}},"pattern":"normal","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":true,"guoHuFan":-1,"hued":true,"iszimo":true,"isGangHu":false,"actions":[{"type":"diangang","targets":[1],"score":40},{"type":"zimo","targets":[0,1,3],"iszimo":true}],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"isHaiDiHu":false},{"game":null,"seatIndex":3,"userId":24,"holds":[24,23,20,25],"folds":[33,33,32,17,8,28,23,13,18,26,9],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[2,10,31],"chis":[[20,22,21]],"huas":[34],"que":-1,"ifJustGanged":-2,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":1,"21":0,"22":0,"23":1,"24":1,"25":1,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"20":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":true},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0}],"numOfQue":0,"turn":2,"chuPai":-1,"state":"playing","firstHupai":2,"yipaoduoxiang":-1,"fangpaoshumu":0,"actionList":[3,1,33,0,2,16,0,1,31,1,2,21,1,1,31,2,2,28,2,1,28,3,2,33,3,1,33,0,2,19,0,1,30,1,2,27,1,1,6,2,2,23,2,1,17,3,2,17,3,1,32,0,2,13,0,1,16,1,2,15,1,1,15,2,2,0,2,1,2,3,3,2,3,1,29,2,3,29,2,1,9,3,2,10,3,1,17,0,2,19,0,1,10,3,3,10,3,1,12,0,7,12,0,1,7,1,2,19,1,1,19,0,3,19,0,1,21,1,2,0,1,1,0,2,4,0,2,2,31,2,1,31,3,2,13,3,1,8,0,2,32,0,1,32,1,2,32,1,1,32,2,2,6,2,1,11,3,2,28,3,1,28,0,2,24,0,1,23,1,7,23,1,1,4,2,2,7,2,1,23,3,2,25,3,1,13,0,2,30,0,1,30,1,2,5,1,1,12,2,2,25,2,1,21,3,7,21,3,1,18,0,2,12,0,1,12,1,2,29,1,1,29,2,2,5,2,1,26,3,2,9,3,1,9,0,2,22,0,1,22,1,2,1,1,1,1,2,2,24,2,6,24],"hupaiList":[2],"chupaiCnt":41,"fangpaoindex":-1,"leftlength":128,"baseInfoJson":null,"lastHuPaiSeat":2,"qiangGangContext":null} ';
game = JSON.parse(game);
switch(game.conf.type) {
    case "sjmmj":sjmmj.calculateRes(game);break;
    case "dhmj":dhmj.calculateRes(game);break;
    case "tdh":tdh.calculateRes(game);break;
}
consoleRES(game);
return;