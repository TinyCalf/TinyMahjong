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
        console.log("丝数："+sd.si);
        console.log("胡数："+sd.fan);
        console.log("分数："+sd.score);
    }
};

//Jonathan 新增读取样本，用于测试场景重现
var game = '{"conf":{"type":"sjmmj","hongzhongdanghua":false,"koufei":0,"quanshu":1,"jiesuan":1,"maxGames":100,"baseScore":20,"maxFan":10000,"creator":20},"roomInfo":{"uuid":"1492926872537574689","id":"574689","numOfGames":2,"fengxiang":0,"createTime":1492926873,"beginButton":1,"nextButton":2,"seats":[{"userId":20,"score":50,"name":"东阳赌侠","ready":true,"seatIndex":0,"numZiMo":0,"numJiePao":1,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"},{"userId":21,"score":-10,"name":"东方有钱","ready":true,"seatIndex":1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"},{"userId":23,"score":-10,"name":"东郭稳赢","ready":true,"seatIndex":2,"numZiMo":0,"numJiePao":0,"numDianPao":1,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"},{"userId":24,"score":-30,"name":"上官好运","ready":true,"seatIndex":3,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:115.209.65.23"}],"ifPayed":true,"conf":{"type":"sjmmj","hongzhongdanghua":false,"koufei":0,"quanshu":1,"jiesuan":1,"maxGames":100,"baseScore":20,"maxFan":10000,"creator":20},"gameMgr":{}},"gameIndex":2,"button":2,"mahjongs":[19,24,19,38,12,9,23,7,6,5,17,0,26,1,15,20,28,22,18,6,16,27,10,29,33,13,5,17,23,26,13,25,4,25,0,21,30,3,2,26,31,39,19,34,4,33,21,9,21,14,13,21,9,13,18,10,32,11,15,24,0,17,2,4,6,20,8,1,37,5,14,11,33,12,1,29,28,16,3,0,16,29,18,26,35,32,31,31,28,40,7,22,2,1,8,10,29,3,27,7,23,3,36,10,20,22,25,28,17,11,16,30,12,31,8,22,4,14,7,9,15,25,15,41,30,5,2,32,27,19,8,24,20,30,18,11,24,32,23,6,33,12,14,27],"currentIndex":109,"gameSeats":[{"game":null,"seatIndex":0,"userId":20,"holds":[19,15,19,13,10,14,11],"folds":[17,6,2,18,14,29,29,31,2,29,23,19,28],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[0],"chis":[[21,23,22]],"huas":[],"que":-1,"ifJustGanged":-26,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":1,"11":1,"12":0,"13":1,"14":1,"15":1,"16":0,"17":0,"18":0,"19":2,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"9":{"pattern":"normal","fan":0},"12":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":1,"userId":21,"holds":[17,21,21,17,17],"folds":[32,29,8,33,28,26,25,31,18],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[20],"chis":[[6,7,5],[9,11,10]],"huas":[34,38],"que":-1,"ifJustGanged":-25,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":3,"18":0,"19":0,"20":0,"21":2,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"38":0},"tingMap":{"17":{"fan":1},"21":{"fan":1}},"canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":true,"guoHuFan":-1,"hued":true,"iszimo":true,"isGangHu":false,"actions":[{"type":"zimo","targets":[0,2,3],"iszimo":true}],"si":0,"tai":0,"fan":1,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"isHaiDiHu":false},{"game":null,"seatIndex":2,"userId":23,"holds":[12,6,4,4,21,2,1,12,0,22],"folds":[33,31,30,28,9,28,15,1,8,27,3,10],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[16],"chis":[],"huas":[36],"que":-1,"ifJustGanged":-1,"huanpais":null,"countMap":{"0":1,"1":1,"2":1,"3":0,"4":2,"5":0,"6":1,"7":0,"8":0,"9":0,"10":0,"11":0,"12":2,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":1,"22":1,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":3,"userId":24,"holds":[5,26,3,24,4,5,3,7,7,25],"folds":[33,27,18,1,9,26,23,24,26,32,22,10,3,1,25],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[13],"chis":[],"huas":[39,37,35,40],"que":-1,"ifJustGanged":-5,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":2,"4":1,"5":2,"6":0,"7":2,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":1,"25":1,"26":1,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"39":0},"tingMap":{"4":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"si":0,"tai":0,"fan":0,"score":0,"lastFangGangSeat":-1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0}],"numOfQue":0,"turn":1,"chuPai":-1,"state":"playing","firstHupai":1,"yipaoduoxiang":-1,"fangpaoshumu":0,"actionList":[2,1,33,3,2,18,3,1,33,0,2,10,0,1,5,1,7,5,1,1,32,2,2,15,2,1,31,3,2,24,3,1,27,0,2,0,0,1,17,1,2,17,1,1,29,2,2,2,2,1,30,3,2,4,3,1,18,0,2,6,0,1,6,1,2,20,1,1,0,0,3,0,0,1,2,1,2,8,1,1,8,2,2,1,2,1,28,3,2,5,3,1,1,0,2,14,0,1,13,3,3,13,3,1,9,0,2,11,0,1,18,1,2,33,1,1,33,2,2,12,2,1,26,3,2,1,3,1,14,0,2,29,0,1,29,1,2,28,1,1,28,2,2,16,2,1,9,3,2,3,3,1,22,0,7,22,0,1,10,1,7,10,1,1,26,2,2,0,2,1,23,3,2,16,3,1,24,0,2,29,0,1,29,1,2,18,1,1,25,2,2,26,2,1,26,3,2,32,3,1,32,0,2,31,0,1,31,1,2,31,1,1,31,2,2,28,2,1,28,3,2,7,3,1,16,2,3,16,2,1,15,3,2,22,3,1,22,0,2,2,0,1,2,1,2,1,1,1,1,2,2,8,2,1,8,3,2,10,3,1,10,0,2,29,0,1,29,1,2,3,1,1,3,2,2,27,2,1,27,3,2,7,3,1,1,0,2,23,0,1,23,1,2,3,1,1,3,2,2,10,2,1,10,3,2,20,3,1,20,1,3,20,1,1,18,2,2,22,2,1,19,3,2,25,3,1,25,0,2,28,0,1,28,1,2,17,1,6,17],"hupaiList":[1],"chupaiCnt":56,"fangpaoindex":-1,"leftlength":130,"baseInfoJson":null,"lastHuPaiSeat":1,"qiangGangContext":null} ';
game = JSON.parse(game);
game.gameSeats[0].sanchisanpeng = [0,0,0,3];
game.gameSeats[1].sanchisanpeng = [3,0,0,0];
switch(game.conf.type) {
    case "sjmmj":sjmmj.calculateRes(game);break;
    case "dhmj":dhmj.calculateRes(game);break;
    case "tdh":tdh.calculateRes(game);break;
}
consoleRES(game);
return;