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
    console.log(inZH.join("、"));
    return;
};

var consoleRES = function (game) {
    for (var i = 0 ; i < 4 ; i++ ) {
        var sd = game.gameSeats[i];
        console.log("--------------------------------------------------------");
        console.log("玩家"+i);
        consoleHolds(sd);
        console.log("分数："+sd.score);
    }
};

//Jonathan 新增读取样本，用于测试场景重现
var game = '{"conf":{"type":"dhmj","koufei":0,"quanshu":0,"jiesuan":0,"maxGames":8,"baseScore":20,"maxFan":10000,"creator":4},"roomInfo":{"uuid":"1492838959117904684","id":"904684","numOfGames":1,"createTime":1492838960,"nextButton":0,"seats":[{"userId":4,"score":0,"name":"东郭好运","ready":true,"seatIndex":0,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:192.168.1.121"},{"userId":3,"score":0,"name":"上官赌圣","ready":true,"seatIndex":1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:192.168.1.121"},{"userId":2,"score":0,"name":"东方雀圣","ready":true,"seatIndex":2,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:192.168.1.121"},{"userId":10,"score":0,"name":"夏侯稳赢","ready":true,"seatIndex":3,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:192.168.1.121"}],"conf":{"type":"dhmj","koufei":0,"quanshu":0,"jiesuan":0,"maxGames":8,"baseScore":20,"maxFan":10000,"creator":4},"gameMgr":{}},"gameIndex":1,"button":0,"mahjongs":[0,0,0,11,1,1,1,11,2,2,2,11,3,3,3,0,4,4,4,0,5,5,5,0,6,6,6,3,7,7,7,3,8,8,8,3,9,9,9,6,10,10,10,6,12,12,12,6,12,12,12,7,3,19,19,26,11,35,15,19,21,38,12,24,18,23,1,27,28,22,9,18,2,25,16,37,17,31,22,33,25,10,21,9,11,12,18,33,25,11,2,0,27,25,31,4,9,30,5,17,4,15,8,21,31,28,5,24,26,24,33,14,7,20,41,20,7,27,11,32,33,14,29,13,16,4,6,30,2,30,19,29,8,29,4,12,23,39,18,7,3,28,32,32],"currentIndex":56,"gameSeats":[{"game":null,"seatIndex":0,"userId":4,"holds":[0,1,2,4,5,6,7,8,9,10,12,12,3,11],"folds":[],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[],"huas":[],"que":-1,"ifJustGanged":-15,"huanpais":null,"countMap":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1,"11":1,"12":2,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"11":{"pattern":"normal","fan":0}},"pattern":"normal","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":true,"right":true},"canChuPai":false,"guoHuFan":-1,"hued":true,"iszimo":false,"isGangHu":false,"actions":[{"type":"hu","targets":[3],"iszimo":false}],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,0,0,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"fan":0,"isHaiDiHu":false},{"game":null,"seatIndex":1,"userId":3,"holds":[0,1,2,3,4,5,6,7,8,9,10,12,12],"folds":[19],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[],"huas":[],"que":-1,"ifJustGanged":-15,"huanpais":null,"countMap":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1,"11":0,"12":2,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"11":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":true,"canChi":false,"chitype":{"left":true,"mid":true,"right":true},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,0,0,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":2,"userId":2,"holds":[0,1,2,3,4,5,6,7,8,9,10,12,12],"folds":[19],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[],"huas":[],"que":-1,"ifJustGanged":-15,"huanpais":null,"countMap":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1,"11":0,"12":2,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"11":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":true,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,0,0,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":3,"userId":10,"holds":[11,11,0,0,0,3,3,3,6,6,6,7,26],"folds":[3],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[],"huas":[],"que":-1,"ifJustGanged":-15,"huanpais":null,"countMap":{"0":3,"1":0,"2":0,"3":3,"4":0,"5":0,"6":3,"7":1,"8":0,"9":0,"10":0,"11":2,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":1,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[{"type":"fangpao","targets":[0]}],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,0,0,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0}],"numOfQue":0,"turn":3,"chuPai":11,"state":"playing","firstHupai":0,"yipaoduoxiang":-1,"fangpaoshumu":1,"actionList":[0,1,3,1,2,19,1,1,19,2,2,19,2,1,19,3,2,26,3,1,11,0,5,11],"hupaiList":[0],"chupaiCnt":4,"fangpaoindex":3,"baseInfoJson":null,"lastHuPaiSeat":0,"qiangGangContext":null} ';
game = JSON.parse(game);
game.gameSeats[0].sanchisanpeng = [0,0,0,3];
game.gameSeats[1].sanchisanpeng = [3,0,0,0];
dhmj.calculateRes(game);
consoleRES(game);


return;