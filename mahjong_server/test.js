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

var consoleHuas = function (seatData) {
    var hds = ["1筒","2筒","3筒","4筒","5筒","6筒","7筒","8筒","9筒",
        "1条","2条","3条","4条","5条","6条","7条","8条","9条",
        "1万","2万","3万","4万","5万","6万","7万","8万","9万",
        "中","发","白","东","西","南","北","春","夏","秋","冬","梅","兰","竹","菊"];
    var huas = seatData.huas;
    var inZH = [].concat(huas);
    inZH.sort(function(a,b){
        return parseInt(a-b);
    });
    for (var i = 0; i < inZH.length ; i++) {
        inZH[i] = hds[inZH[i]];
    }
    console.log("花牌为：" + inZH.join("、"));
    return;
};


var consoleRES = function (game) {
    for (var i = 0 ; i < 4 ; i++ ) {
        var sd = game.gameSeats[i];
        console.log("--------------------------------------------------------");
        console.log("玩家"+i);
        consoleHolds(sd);
        consoleHuas(sd);
        (sd.bian) ? console.log("边"):{};
        (sd.kan) ? console.log("坎"):{};
        (sd.dan) ? console.log("单"):{};
        (sd.duidao) ? console.log("对到"):{};
        (sd.paihu) ? console.log("排胡"):{};
        console.log(sd.sanchisanpeng);
        // consoleHuas(sd);
        // consoleChi(sd);
        // consolePeng(sd);
        console.log("台数："+sd.tai);
        console.log("分数："+sd.score);
    }
};

//Jonathan 新增读取样本，用于测试场景重现
var game = '{"conf":{"type":"dhmj","koufei":0,"quanshu":0,"jiesuan":2,"maxGames":8,"baseScore":20,"maxFan":10000,"creator":61},"roomInfo":{"uuid":"1496293639706998546","id":"998546","numOfGames":5,"createTime":1496293640,"nextButton":3,"fengxiang":0,"beginButton":0,"seats":[{"userId":61,"score":50,"name":"夏侯稳赢","ready":true,"seatIndex":0,"numZiMo":0,"numJiePao":2,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:123.96.222.58"},{"userId":62,"score":110,"name":"长孙赌侠","ready":true,"seatIndex":1,"numZiMo":1,"numJiePao":0,"numDianPao":1,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:123.96.222.58"},{"userId":64,"score":-30,"name":"东郭好运","ready":true,"seatIndex":2,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:123.96.222.58"},{"userId":63,"score":-130,"name":"上官赌圣","ready":true,"seatIndex":3,"numZiMo":0,"numJiePao":1,"numDianPao":2,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:123.96.222.58"}],"conf":{"type":"dhmj","koufei":0,"quanshu":0,"jiesuan":2,"maxGames":8,"baseScore":20,"maxFan":10000,"creator":61},"gameMgr":{}},"gameIndex":5,"button":3,"mahjongs":[8,4,29,5,27,5,28,25,7,0,14,4,23,33,31,12,23,21,5,22,33,30,19,18,32,18,9,10,31,22,2,4,17,23,22,13,24,8,10,14,1,36,21,0,12,27,39,20,11,19,9,30,15,24,14,12,21,32,22,32,31,16,26,7,33,20,7,15,23,28,1,31,1,15,20,26,6,13,17,28,29,41,13,17,4,6,2,24,29,13,17,12,37,9,8,10,16,1,25,10,34,6,9,18,11,27,26,35,29,3,30,14,25,33,6,20,25,19,32,27,3,15,7,19,30,11,0,38,0,2,26,5,11,3,28,8,21,2,24,16,3,40,18,16],"currentIndex":124,"gameSeats":[{"game":null,"seatIndex":0,"userId":61,"holds":[21,22,19,20,19],"folds":[33,32,30,27,31,23,18,8,17,8,25,18,29,25,25],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[[23,24,22],[14,15,13],[5,7,6]],"huas":[36,35],"que":-1,"ifJustGanged":-3,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":2,"20":1,"21":1,"22":1,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"36":0},"tingMap":{"19":{"pattern":"normal","fan":0},"22":{"pattern":"normal","fan":0}},"pattern":"normal","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":true,"mid":false,"right":false},"canChuPai":false,"kanzi":[[20,21,22],[19,20,21],[20,21,22],[19,20,21],[20,21,22],[19,20,21],[20,21,22],[19,20,21],[20,21,22],[19,20,21],[20,21,22],[19,20,21],[20,21,22],[19,20,21],[20,21,22],[19,20,21],[20,21,22],[19,20,21],[20,21,22],[19,20,21]],"guoHuFan":-1,"hued":true,"iszimo":false,"isGangHu":false,"actions":[{"type":"hu","targets":[3],"iszimo":false}],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,0,0,3],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"fan":0,"isHaiDiHu":false},{"game":null,"seatIndex":1,"userId":62,"holds":[19,9,9,19],"folds":[31,31,33,29,28,5,28,21,10,9,10,10,9,11,3,33,21,15],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[[1,2,0],[12,14,13],[22,23,24]],"huas":[39],"que":-1,"ifJustGanged":-30,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":2,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":2,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"39":0},"tingMap":{"9":{"fan":1},"19":{"fan":1}},"pattern":"","canGang":false,"gangPai":[],"canPeng":true,"canHu":true,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"kanzi":[[19,20,21],[19,20,21],[19,20,21],[19,20,21],[19,20,21],[19,20,21],[19,20,21]],"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[3,0,0,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":2,"userId":64,"holds":[25,20,20,26],"folds":[32,30,0,28,18,29,17,4,4,29,12,16,6,27,30,6,20,32,7],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[[15,16,17],[4,5,6],[13,14,12]],"huas":[34],"que":-1,"ifJustGanged":-5,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":2,"21":0,"22":0,"23":0,"24":0,"25":1,"26":1,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"24":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"kanzi":[[12,13,14],[24,25,26],[12,13,14],[24,25,26],[24,25,26],[24,25,26],[24,25,26],[24,25,26],[24,25,26],[24,25,26],[24,25,26],[24,25,26]],"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,3,0,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":3,"userId":63,"holds":[1,15,1,2,13,1,14],"folds":[33,32,31,27,26,7,8,17,7,26,4,27,3],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[[11,12,10],[23,24,22]],"huas":[41,37],"que":-1,"ifJustGanged":-7,"huanpais":null,"countMap":{"0":0,"1":3,"2":1,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":1,"14":1,"15":1,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"0":{"pattern":"normal","fan":0},"2":{"pattern":"normal","fan":0},"3":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"kanzi":[[15,16,17],[22,23,24],[6,7,8],[15,16,17],[6,7,8],[15,16,17],[6,7,8],[13,14,15],[0,1,2],[13,14,15],[1,1,1],[13,14,15],[1,2,3],[13,14,15],[0,1,2],[13,14,15],[1,1,1],[13,14,15],[1,2,3],[13,14,15],[0,1,2],[13,14,15],[1,1,1],[13,14,15],[1,2,3],[13,14,15],[0,1,2],[13,14,15],[1,1,1],[13,14,15],[1,2,3]],"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[{"type":"fangpao","targets":[0]}],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,0,2,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0}],"numOfQue":0,"turn":3,"chuPai":19,"state":"playing","firstHupai":0,"yipaoduoxiang":-1,"fangpaoshumu":1,"actionList":[3,1,33,0,2,14,0,1,33,1,2,21,1,1,31,2,2,32,2,1,32,3,2,22,3,1,32,0,2,32,0,1,32,1,2,31,1,1,31,2,2,16,2,1,30,3,2,26,3,1,31,0,2,7,0,1,30,1,2,33,1,1,33,2,2,20,2,1,0,3,2,7,3,1,27,0,2,15,0,1,27,1,2,23,1,1,29,2,2,28,2,1,28,3,2,1,3,1,26,0,2,31,0,1,31,1,2,1,1,1,28,2,2,15,2,1,10,3,7,10,3,1,23,0,2,20,0,1,0,1,7,0,1,1,5,2,2,26,2,1,18,3,2,6,3,1,7,0,2,13,0,1,18,1,2,17,1,1,17,2,7,17,2,1,22,3,7,22,3,1,22,0,7,22,0,1,8,1,2,28,1,1,28,2,2,29,2,1,29,3,2,13,3,1,13,0,7,13,0,1,13,1,7,13,1,1,21,2,2,17,2,1,17,3,2,4,3,1,6,0,7,6,0,1,4,1,2,6,1,1,6,2,7,6,2,1,4,3,2,2,3,1,8,0,2,24,0,1,24,1,7,24,1,1,10,2,2,29,2,1,29,3,2,13,3,1,17,0,2,17,0,1,17,1,2,12,1,1,12,2,7,12,2,1,12,3,2,9,3,1,9,0,2,8,0,1,8,1,2,10,1,1,10,2,2,16,2,1,16,3,2,1,3,1,7,0,2,25,0,1,25,1,2,10,1,1,10,2,2,6,2,1,6,3,2,9,3,1,9,0,2,18,0,1,18,1,2,11,1,1,11,2,2,27,2,1,27,3,2,26,3,1,26,0,2,29,0,1,29,1,2,3,1,1,3,2,2,30,2,1,30,3,2,14,3,1,4,0,2,25,0,1,25,1,2,33,1,1,33,2,2,6,2,1,6,3,2,20,3,1,20,0,2,25,0,1,25,1,2,19,1,1,21,2,2,32,2,1,32,3,2,27,3,1,27,0,2,3,0,1,3,1,2,15,1,1,15,2,2,7,2,1,7,3,2,19,3,1,19,0,5,19],"hupaiList":[0],"chupaiCnt":77,"fangpaoindex":3,"baseInfoJson":null,"lastHuPaiSeat":0,"qiangGangContext":null} ';
game = JSON.parse(game);
for(var i =0 ; i < 4; i++) {
    game.gameSeats[i].kanzi = [];
}
switch(game.conf.type) {
    case "sjmmj":sjmmj.calculateRes(game);break;
    case "dhmj":dhmj.calculateRes(game);break;
    case "tdh":tdh.calculateRes(game);break;
}
consoleRES(game);
return;
