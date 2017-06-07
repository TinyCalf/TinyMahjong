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
var game = '{"conf":{"type":"dhmj","koufei":1,"quanshu":0,"jiesuan":1,"maxGames":8,"baseScore":20,"maxFan":10000,"creator":78},"roomInfo":{"uuid":"1496282808155732952","id":"732952","numOfGames":1,"fengxiang":0,"createTime":1496282809,"beginButton":2,"nextButton":2,"seats":[{"userId":78,"score":0,"name":"长孙赌侠","ready":true,"seatIndex":0,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:183.245.242.5"},{"userId":79,"score":0,"name":"上官赌圣","ready":true,"seatIndex":1,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:183.245.242.5"},{"userId":80,"score":0,"name":"东郭好运","ready":true,"seatIndex":2,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:183.245.242.5"},{"userId":81,"score":0,"name":"夏侯稳赢","ready":true,"seatIndex":3,"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:183.245.242.5"}],"ifPayed":false,"conf":{"type":"dhmj","koufei":1,"quanshu":0,"jiesuan":1,"maxGames":8,"baseScore":20,"maxFan":10000,"creator":78},"gameMgr":{}},"gameIndex":1,"button":2,"mahjongs":[19,4,29,30,10,4,33,17,1,2,18,30,40,18,28,8,29,14,21,7,1,32,6,9,20,23,19,39,6,17,15,32,34,29,35,26,25,7,0,3,20,8,18,28,2,12,17,22,30,32,14,14,32,30,16,28,11,15,22,41,37,2,6,26,13,17,14,29,19,21,5,4,21,24,7,27,24,16,33,16,1,26,31,6,9,8,33,0,16,24,10,8,36,28,15,3,13,23,5,7,31,27,13,11,5,15,25,22,5,11,23,27,9,0,3,31,24,38,10,1,18,27,13,19,12,12,3,0,33,20,25,23,11,12,26,31,21,9,4,25,22,20,2,10],"currentIndex":141,"gameSeats":[{"game":null,"seatIndex":0,"userId":78,"holds":[7,8,5,22],"folds":[29,33,29,0,17,11,8,26,21,8,19,15,13,5,25,4,11,0,10,13,25,26],"angangs":[],"diangangs":[],"wangangs":[28],"pengs":[18],"chis":[[14,15,16]],"huas":[35,36,38],"que":-1,"ifJustGanged":-6,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":1,"6":0,"7":1,"8":1,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":1,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"35":0},"tingMap":{},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[{"type":"wangang","targets":[1,2,3],"score":20},{"type":"fangpao","targets":[1]}],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[1,1,0,2],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":1,"userId":79,"holds":[8,22,7,22,6],"folds":[32,26,9,17,27,33,31,33,24,3,7,11,3,3,0,31],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[30],"chis":[[14,15,13],[2,3,4]],"huas":[39,41,37],"que":-1,"ifJustGanged":-18,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":1,"7":1,"8":1,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":2,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"39":0},"tingMap":{"6":{"pattern":"normal","fan":0}},"pattern":"normal","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":true,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":true,"iszimo":false,"isGangHu":false,"actions":[{"type":"hu","targets":[0],"iszimo":false}],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[2,0,1,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"fan":0,"isHaiDiHu":false},{"game":null,"seatIndex":2,"userId":80,"holds":[19,1,1,20,6,6,21],"folds":[29,25,10,2,24,30,17,16,10,13,31,22,27,31,1,18,19,12,33,11,21,16],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[[20,21,19],[5,6,4]],"huas":[34,40],"que":-1,"ifJustGanged":-35,"huanpais":null,"countMap":{"0":0,"1":2,"2":0,"3":0,"4":0,"5":0,"6":2,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":1,"20":1,"21":1,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"40":0},"tingMap":{"1":{"pattern":"normal","fan":0},"6":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":true,"canHu":true,"canChi":false,"chitype":{"left":true,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,2,0,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":3,"userId":81,"holds":[23,7,5,23],"folds":[29,26,17,12,9,24,4,27,14,23,9,24,27,12,20,23,12,9,25],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[32],"chis":[[1,2,0],[14,15,16]],"huas":[],"que":-1,"ifJustGanged":-33,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":1,"6":0,"7":1,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":2,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"6":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":true,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,0,3,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0}],"numOfQue":0,"turn":0,"chuPai":6,"state":"playing","firstHupai":1,"yipaoduoxiang":-1,"fangpaoshumu":1,"actionList":[2,1,32,3,3,32,3,1,29,0,2,11,0,1,29,1,2,22,1,1,28,0,3,28,0,1,33,1,2,2,1,1,32,2,2,6,2,1,29,3,2,26,3,1,26,0,2,13,0,1,13,1,7,13,1,1,26,2,2,17,2,1,25,3,2,14,3,1,17,0,2,29,0,1,29,1,2,19,1,1,9,2,2,21,2,1,10,3,2,5,3,1,18,0,3,18,0,1,0,1,2,4,1,1,17,2,2,21,2,1,2,3,2,24,3,1,12,0,2,7,0,1,17,1,2,27,1,1,27,2,2,24,2,1,24,3,2,16,3,1,16,0,7,16,0,1,11,1,2,33,1,1,33,2,2,16,2,1,30,1,3,30,1,1,19,2,7,19,2,1,30,3,2,1,3,1,8,0,2,26,0,1,26,1,2,31,1,1,31,2,2,6,2,1,17,3,2,9,3,1,9,0,2,8,0,1,21,1,2,33,1,1,33,2,2,0,2,1,0,3,7,0,3,1,24,0,2,16,0,1,16,1,2,24,1,1,24,2,2,10,2,1,10,3,2,8,3,1,8,0,2,28,0,4,28,0,2,15,0,1,19,1,2,3,1,1,3,2,2,13,2,1,13,3,2,23,3,1,4,0,2,5,0,1,15,1,2,7,1,1,7,2,2,31,2,1,31,3,2,27,3,1,27,0,2,13,0,1,13,1,2,11,1,1,11,2,2,5,2,1,5,3,2,15,3,1,14,0,2,25,0,1,25,1,2,22,1,1,22,2,2,5,2,1,16,3,7,16,3,1,4,0,2,11,0,1,11,1,2,23,1,1,23,2,2,27,2,1,27,3,2,9,3,1,9,0,2,0,0,1,0,1,2,3,1,1,3,2,2,31,2,1,31,3,2,24,3,1,24,0,2,10,0,1,10,1,2,1,1,1,1,2,2,18,2,1,18,3,2,27,3,1,27,0,2,13,0,1,13,1,2,19,1,1,19,2,2,12,2,1,12,3,2,12,3,1,12,0,2,3,0,1,3,1,2,0,1,1,0,2,2,33,2,1,33,3,2,20,3,1,20,0,2,25,0,1,25,1,2,23,1,1,23,2,2,11,2,1,11,3,2,12,3,1,12,0,2,26,0,1,26,1,2,31,1,1,31,2,2,21,2,1,21,3,2,9,3,1,9,0,2,4,0,1,4,1,7,4,1,1,4,2,7,4,2,1,16,3,2,25,3,1,25,0,2,22,0,1,6,1,5,6],"hupaiList":[1],"chupaiCnt":91,"fangpaoindex":0,"kanzi":[[2,3,4],[6,7,8],[2,3,4],[6,7,8],[6,6,6],[1,1,1],[19,20,21],[16,16,16],[6,6,6],[19,20,21],[6,7,8],[2,3,4],[6,7,8],[6,6,6],[1,1,1],[19,20,21],[16,16,16],[6,6,6],[19,20,21],[6,7,8],[2,3,4],[6,7,8],[6,6,6],[1,1,1],[19,20,21],[16,16,16],[6,6,6],[19,20,21],[6,7,8],[6,7,8],[2,3,4],[6,7,8],[6,6,6],[1,1,1],[19,20,21],[16,16,16],[6,6,6],[19,20,21],[6,7,8],[5,6,7],[2,3,4],[6,7,8],[6,6,6],[1,1,1],[19,20,21],[16,16,16],[6,6,6],[19,20,21],[6,7,8],[5,6,7],[2,3,4],[6,7,8],[6,6,6],[1,1,1],[19,20,21],[16,16,16],[6,6,6],[19,20,21],[6,7,8],[5,6,7],[2,3,4],[6,7,8],[5,6,7],[6,7,8],[5,6,7],[2,3,4],[6,7,8],[5,6,7],[6,7,8],[5,6,7],[2,3,4],[6,7,8],[5,6,7],[6,7,8],[5,6,7],[2,3,4],[6,7,8],[5,6,7],[6,7,8],[5,6,7],[2,3,4],[6,7,8],[5,6,7],[6,7,8],[5,6,7],[2,3,4],[6,7,8],[5,6,7],[6,7,8],[5,6,7],[2,3,4],[6,7,8],[5,6,7],[6,7,8],[5,6,7],[2,3,4],[6,7,8],[5,6,7],[6,7,8],[5,6,7],[6,7,8],[1,1,1],[19,20,21],[6,6,6],[19,20,21],[5,6,7]],"baseInfoJson":null,"lastHuPaiSeat":1,"qiangGangContext":null}';
game = JSON.parse(game);
for(var i =0 ; i < 4; i++) {
    game.gameSeats[i].kanzi = [];
    game.gameSeats[i].game = game;
}
switch(game.conf.type) {
    case "sjmmj":sjmmj.calculateRes(game);break;
    case "dhmj":dhmj.calculateRes(game);break;
    case "tdh":tdh.calculateRes(game);break;
}
consoleRES(game);
return;
