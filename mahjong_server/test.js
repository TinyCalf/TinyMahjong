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
var game = '{"conf":{"type":"tdh","koufei":0,"quanshu":0,"jiesuan":0,"maxGames":8,"baseScore":20,"maxFan":10000,"creator":2},"roomInfo":{"uuid":"1493087513908454188","id":"454188","numOfGames":1,"createTime":1493087514,"nextButton":0,"seats":[{"userId":2,"score":0,"name":"东方雀圣","ready":true,"seatIndex":0,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:192.168.1.121"},{"userId":3,"score":0,"name":"上官赌圣","ready":true,"seatIndex":1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:192.168.1.121"},{"userId":4,"score":0,"name":"东郭好运","ready":true,"seatIndex":2,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:192.168.1.121"},{"userId":10,"score":0,"name":"夏侯稳赢","ready":true,"seatIndex":3,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:192.168.1.121"}],"conf":{"type":"tdh","koufei":0,"quanshu":0,"jiesuan":0,"maxGames":8,"baseScore":20,"maxFan":10000,"creator":2},"gameMgr":{}},"gameIndex":1,"button":0,"mahjongs":[0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,12,13,12,13,12,14,12,16,14,15,14,16,15,15,15,16,18,18,18,18,12,2,10,30,41,19,4,5,12,17,30,7,10,27,11,9,28,26,13,0,16,33,1,0,38,11,20,3,0,26,15,29,29,16,8,25,15,6,13,32,25,24,24,9,4,31,21,8,12,23,16,7,5,1,14,39,5,14,21,32,21,19,7,14,33,4,13,23,6,3,7,27,9,35,30,15,11,30,17,14,19,2,1,26,23,4,15,18],"currentIndex":57,"gameSeats":[{"game":null,"seatIndex":0,"userId":2,"holds":[0,1,2,3,4,5,6,7,8,12,14,15,18],"folds":[18],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[],"huas":[],"que":-1,"ifJustGanged":-16,"huanpais":null,"countMap":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":0,"10":0,"11":0,"12":1,"13":0,"14":1,"15":1,"16":0,"17":0,"18":1,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"tai":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":1,"userId":3,"holds":[0,1,2,3,4,5,6,7,8,13,14,15,15,12],"folds":[15,18],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[],"huas":[],"que":-1,"ifJustGanged":-15,"huanpais":null,"countMap":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":0,"10":0,"11":0,"12":1,"13":1,"14":1,"15":2,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"12":{"pattern":"normal","fan":0},"15":{"pattern":"normal","fan":0}},"pattern":"normal","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":true,"iszimo":false,"isGangHu":false,"actions":[{"type":"qiangganghu","targets":[2],"iszimo":true}],"tai":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"isQiangGangHu":true,"fan":0,"isHaiDiHu":false},{"game":null,"seatIndex":2,"userId":4,"holds":[0,1,2,3,4,5,6,7,8,14],"folds":[],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[12],"chis":[],"huas":[],"que":-1,"ifJustGanged":-15,"huanpais":null,"countMap":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":0,"10":0,"11":0,"12":0,"13":0,"14":1,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"14":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[{"type":"beiqianggang","targets":[1]}],"tai":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":3,"userId":10,"holds":[0,1,2,3,4,5,6,7,8,13,16,16,16],"folds":[18],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[],"huas":[],"que":-1,"ifJustGanged":-15,"huanpais":null,"countMap":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":0,"10":0,"11":0,"12":0,"13":1,"14":0,"15":0,"16":3,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"13":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"tai":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0}],"numOfQue":0,"turn":2,"chuPai":-1,"state":"playing","firstHupai":1,"yipaoduoxiang":-1,"fangpaoshumu":0,"actionList":[0,1,12,2,3,12,2,1,15,3,2,18,3,1,18,0,2,18,0,1,18,1,2,18,1,1,18,2,2,12,1,5,12],"hupaiList":[1],"chupaiCnt":5,"fangpaoindex":-1,"baseInfoJson":null,"lastHuPaiSeat":1,"qiangGangContext":{"turnSeat":{"game":null,"seatIndex":2,"userId":4,"holds":[0,1,2,3,4,5,6,7,8,14],"folds":[],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[12],"chis":[],"huas":[],"que":-1,"ifJustGanged":-15,"huanpais":null,"countMap":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":0,"10":0,"11":0,"12":0,"13":0,"14":1,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"14":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[{"type":"beiqianggang","targets":[1]}],"tai":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},"seatData":{"game":null,"seatIndex":2,"userId":4,"holds":[0,1,2,3,4,5,6,7,8,14],"folds":[],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[12],"chis":[],"huas":[],"que":-1,"ifJustGanged":-15,"huanpais":null,"countMap":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":0,"10":0,"11":0,"12":0,"13":0,"14":1,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"14":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[{"type":"beiqianggang","targets":[1]}],"tai":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},"pai":12,"isValid":false}} ';
game = JSON.parse(game);
switch(game.conf.type) {
    case "sjmmj":sjmmj.calculateRes(game);break;
    case "dhmj":dhmj.calculateRes(game);break;
    case "tdh":tdh.calculateRes(game);break;
}
consoleRES(game);
return;