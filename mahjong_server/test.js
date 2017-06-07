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
var game = '{"conf":{"type":"dhmj","koufei":0,"quanshu":1,"jiesuan":2,"maxGames":100,"baseScore":20,"maxFan":10000,"creator":3},"roomInfo":{"uuid":"1496802497520020659","id":"020659","numOfGames":10,"fengxiang":1,"createTime":1496802498,"beginButton":1,"nextButton":3,"seats":[{"userId":3,"score":-180,"name":"上官赌圣","ready":true,"seatIndex":0,"numZiMo":0,"numJiePao":2,"numDianPao":4,"numAnGang":0,"numMingGang":4,"numChaJiao":0,"ip":"::ffff:123.96.212.79"},{"userId":4,"score":-140,"name":"东郭好运","ready":true,"seatIndex":1,"numZiMo":0,"numJiePao":1,"numDianPao":2,"numAnGang":0,"numMingGang":1,"numChaJiao":0,"ip":"::ffff:123.96.212.79"},{"userId":2,"score":-60,"name":"长孙赌侠","ready":true,"seatIndex":2,"numZiMo":0,"numJiePao":1,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:123.96.212.79"},{"userId":10,"score":380,"name":"夏侯稳赢","ready":true,"seatIndex":3,"numZiMo":3,"numJiePao":2,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"ip":"::ffff:123.96.212.79"}],"ifPayed":true,"conf":{"type":"dhmj","koufei":0,"quanshu":1,"jiesuan":2,"maxGames":100,"baseScore":20,"maxFan":10000,"creator":3},"gameMgr":{}},"gameIndex":10,"button":3,"mahjongs":[10,9,11,28,16,25,31,24,31,3,4,9,0,20,5,33,39,20,26,1,4,29,8,25,0,16,29,29,3,22,16,18,37,11,32,17,32,19,19,15,26,23,17,41,3,18,29,40,6,17,10,8,24,24,1,21,8,22,14,0,4,21,31,20,27,17,28,23,30,7,33,13,0,2,33,2,3,6,6,13,15,24,5,9,25,1,30,12,2,26,38,13,31,7,16,23,35,5,11,32,10,14,6,18,8,12,23,9,12,10,36,7,33,18,19,14,34,27,15,5,27,7,22,26,28,15,11,14,19,13,30,25,4,30,32,21,2,12,21,1,22,20,27,28],"currentIndex":83,"gameSeats":[{"game":null,"seatIndex":0,"userId":3,"holds":[3,20,20,16,22,19,23,18,17,21,4,23,15,5],"folds":[25,20,27,7,33,11],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[],"chis":[],"huas":[],"que":-1,"ifJustGanged":-23,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":1,"4":1,"5":1,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":1,"16":1,"17":1,"18":1,"19":1,"20":2,"21":1,"22":1,"23":2,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"2":{"pattern":"normal","fan":0},"5":{"pattern":"normal","fan":0}},"pattern":"normal","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":true,"kanzi":[[15,16,17],[20,21,22],[18,19,20],[2,3,4],[15,16,17],[20,21,22],[18,19,20],[3,4,5]],"guoHuFan":-1,"hued":true,"iszimo":true,"isGangHu":false,"actions":[{"type":"zimo","targets":[1,2,3],"iszimo":true}],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,0,0,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0,"fan":0,"isHaiDiHu":false},{"game":null,"seatIndex":1,"userId":4,"holds":[19,17,21,17],"folds":[32,31,33,17,2],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[29],"chis":[[10,11,9],[4,5,6]],"huas":[],"que":-1,"ifJustGanged":-19,"huanpais":null,"countMap":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":2,"18":0,"19":1,"20":0,"21":1,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0},"tingMap":{"20":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"kanzi":[[19,20,21],[19,20,21]],"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[3,0,0,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":2,"userId":2,"holds":[1,22,13,3],"folds":[33,31,18,9,29,28],"angangs":[],"diangangs":[],"wangangs":[],"pengs":[8],"chis":[[24,25,26],[14,15,16]],"huas":[40,41],"que":-1,"ifJustGanged":-18,"huanpais":null,"countMap":{"0":0,"1":1,"2":0,"3":1,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":1,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":1,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"40":0,"41":0},"tingMap":{},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"kanzi":[],"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,3,0,0],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0},{"game":null,"seatIndex":3,"userId":10,"holds":[4,3,3,6,1,2,6],"folds":[32,31,28,30,10,16,13,26],"angangs":[0],"diangangs":[],"wangangs":[],"pengs":[24],"chis":[],"huas":[37,39],"que":-1,"ifJustGanged":-2,"huanpais":null,"countMap":{"0":0,"1":1,"2":1,"3":2,"4":1,"5":0,"6":2,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"37":0,"39":0},"tingMap":{"2":{"pattern":"normal","fan":0},"5":{"pattern":"normal","fan":0}},"pattern":"","canGang":false,"gangPai":[],"canPeng":false,"canHu":false,"canChi":false,"chitype":{"left":false,"mid":false,"right":false},"canChuPai":false,"kanzi":[[1,2,3],[2,3,4],[1,2,3],[3,4,5]],"guoHuFan":-1,"hued":false,"iszimo":false,"isGangHu":false,"actions":[{"type":"angang","targets":[0,1,2],"score":40}],"tai":0,"score":0,"lastFangGangSeat":-1,"sanchisanpeng":[0,1,0,1],"numZiMo":0,"numJiePao":0,"numDianPao":0,"numAnGang":0,"numMingGang":0,"numChaJiao":0}],"numOfQue":0,"turn":0,"chuPai":-1,"state":"playing","firstHupai":0,"yipaoduoxiang":-1,"fangpaoshumu":0,"actionList":[3,8,[37,39],[10,16,31,0,4,0,3,32,26,3,6,24,24,1],3,1,32,0,2,21,0,1,29,1,3,29,1,1,32,2,8,[40,41],[28,24,9,33,1,25,29,18,17,15,8,8,22],2,2,14,2,1,33,3,2,0,3,1,31,0,2,4,0,1,25,1,2,21,1,1,31,2,2,31,2,1,31,3,2,20,3,1,20,0,2,27,0,1,27,1,2,17,1,1,26,2,7,26,[24,25,26],2,1,18,3,2,28,3,1,28,0,2,23,0,1,9,1,7,9,[10,11,9],1,1,8,2,3,8,2,1,9,3,2,30,3,1,30,0,2,7,0,1,7,1,2,33,1,1,33,2,2,13,2,1,17,3,2,0,3,4,0,3,2,2,3,1,10,0,2,33,0,1,33,1,2,2,1,1,2,2,2,3,2,1,29,3,2,6,3,1,16,0,2,6,0,1,6,1,7,6,[4,5,6],1,1,16,2,7,16,[14,15,16],2,1,28,3,2,13,3,1,13,0,2,15,0,1,11,1,2,24,1,1,24,3,3,24,3,1,26,0,2,5,0,6,5],"hupaiList":[0],"chupaiCnt":32,"fangpaoindex":-1,"baseInfoJson":null,"lastHuPaiSeat":0,"qiangGangContext":null} ';
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
