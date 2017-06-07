var roomMgr = require("./roommgr");
var userMgr = require("./usermgr");
var mjutils = require('./mjutils');
var db = require("../utils/db");
var crypto = require("../utils/crypto");
var games = {};
var gamesIdBase = 0;

var ACTION_CHUPAI = 1;
var ACTION_MOPAI = 2;
var ACTION_PENG = 3;
var ACTION_GANG = 4;
var ACTION_CHI = 7;
var ACTION_HU = 5;
var ACTION_ZIMO = 6;
var ACTION_BUHUA = 8;

var gameSeatsOfUsers = {};

//Jonathan 新增功能函数 删除手牌中的指定牌 包括 holds 和 countMap
function removePai(seatData,pai) {
    var holds = seatData.holds;
    var countMap = seatData.countMap;
    for (var i = 0 ; i < holds.length ; i++) {
        if(holds[i] == pai) {
            holds.splice(i,1);
            countMap[pai] --;
            return true;
        }
    }
    return false;
}

//Jonathan 新增舟山补花逻辑
function buhua(game,seatIndex){
    var data = game.gameSeats[seatIndex];
    var pai = game.mahjongs[game.currentIndex];
    var buhuas = [];
    for (var i = 34 ; i < 42 ; i ++ ) {
        if(data.countMap[i] > 0) {
            data.huas.push(i);
            removePai(data,i);
            buhuas.push(i);
        }
    }
    if(game.conf.hongzhongdanghua) {
        if(data.countMap[27] > 0) {
            while(data.countMap[27]>0){
                data.huas.push(27);
                removePai(data,27);
                buhuas.push(27);
            }
        }
    }
    var num = buhuas.length;
    for (var i  = 0 ; i < num; i++ ) {
        if(!game.conf.hongzhongdanghua) {
            while (pai >= 34 && pai < 42) {
                //标记刚刚杠过
                data.ifJustGanged = 1;
                game.gameSeats[seatIndex].huas.push(pai);
                buhuas.push(pai);
                game.currentIndex++;
                pai = game.mahjongs[game.currentIndex];
            }
        }else{
            while (pai >= 34 && pai < 42 || pai == 27) {
                game.gameSeats[seatIndex].huas.push(pai);
                buhuas.push(pai);
                game.currentIndex++;
                pai = game.mahjongs[game.currentIndex];
            }
        }
        data.holds.push(pai);
        (data.countMap[pai] == null)?data.countMap[pai] = 1 : data.countMap[pai] ++;
        game.currentIndex++;
        pai = game.mahjongs[game.currentIndex];
    }

    if(buhuas.length>0) {
        //告诉所有人该玩家补花了
        userMgr.broacastInRoom('buhua_notify_push', {userid: data.userId, buhuas: buhuas}, data.userId, true);
        //告诉该玩家现在的增加的手牌是什么
        userMgr.sendMsg(data.userId,"game_buhua_push",{userid: data.userId, buhuas: buhuas,holds:data.holds});
        recordGameAction(game,seatIndex,ACTION_BUHUA,buhuas,data.holds);
    }

}

//单独的摸牌逻辑 专门为舟山补花逻辑所用 只有开局用跳过出花过程的逻辑
function mopaiforstart(game,seatIndex) {
    if(game.currentIndex == game.mahjongs.length){
        return -1;
    }
    var data = game.gameSeats[seatIndex];
    var mahjongs = data.holds;
    var pai = game.mahjongs[game.currentIndex];

    mahjongs.push(pai);
    //每次摸牌都要把这个标记减一，用于判断杠上花
    data.ifJustGanged --;

    //统计牌的数目 ，用于快速判定（空间换时间）
    var c = data.countMap[pai];
    if(c == null) {
        c = 0;
    }
    data.countMap[pai] = c + 1;
    game.currentIndex ++;
    return pai;
}

function getMJType(id){
    if(id >= 0 && id < 9){
        //筒
        return 0;
    }
    else if(id >= 9 && id < 18){
        //条
        return 1;
    }
    else if(id >= 18 && id < 27){
        //万
        return 2;
    }else{
        return 3;
    }
}

function shuffle(game) {

    /*
     * 0-8 為一到九筒
     * 9-17為一到九條
     * 18-26為一到九萬
     * 27、28、29為 中 發 白
     * 30 31 32 33 為 東 西 南 北 （是 東西南北 不是 東南西北！）
     * 34 35 36 37 為 春 夏 秋 冬
     * 38 39 40 41 為 梅 蘭 竹 菊
     * */

    var mahjongs = game.mahjongs;

    //筒 (0 ~ 8 表示筒子
    var index = 0;
    for(var i = 0; i < 9; ++i){
        for(var c = 0; c < 4; ++c){
            mahjongs[index] = i;
            index++;
        }
    }

    //条 9 ~ 17表示条子
    for(var i = 9; i < 18; ++i){
        for(var c = 0; c < 4; ++c){
            mahjongs[index] = i;
            index++;
        }
    }

    //万
    //条 18 ~ 26表示万
    for(var i = 18; i < 27; ++i){
        for(var c = 0; c < 4; ++c){
            mahjongs[index] = i;
            index++;
        }
    }

    //东南西北中发白
    for(var i = 27; i < 34; ++i){
        for(var c = 0; c < 4; ++c){
            mahjongs[index] = i;
            index++;
        }
    }

    //春夏秋冬梅兰竹菊
    for(var i = 34; i < 42; ++i){
        mahjongs[index] = i;
        index++;
    }

    //打亂順序
    for(var i = 0; i < mahjongs.length; ++i){
        var lastIndex = mahjongs.length - 1 - i;
        var index = Math.floor(Math.random() * lastIndex);
        var t = mahjongs[index];
        mahjongs[index] = mahjongs[lastIndex];
        mahjongs[lastIndex] = t;
    }

    // var index = 0 ;
    // var mjs = [30,30,30,30,4,5,6,7,8,9,10,27,27];
    // for (var i =0 ; i < mjs.length ; i++) {
    //     for(var j = 0 ; j < 4 ; j++) {
    //         game.mahjongs[index] = mjs[i];
    //         index++;
    //     }
    // }

    //抢杠胡
    // var index = 0 ;
    // var mjs0 = [0,1,2,3,4,5,6,7,8,12,12,2,2];//chu 2
    // var mjs1 = [0,1,3,4,5,6,7,8,9,9,9,10,10];//胡2
    // var mjs2 = [2,3,4,5,9,10,11,12,13,14,15,16,17];//hu2
    // var mjs3 = [2,2,3,3,9,10,11,12,13,14,15,16,17];//duidao2
    // var mjs = [];
    // for (var i = 0; i < 13 ; i++ ) {
    //     mjs.push(mjs0[i]);
    //     mjs.push(mjs1[i]);
    //     mjs.push(mjs2[i]);
    //     mjs.push(mjs3[i]);
    // }
    // mjs.push(18);
    // mjs.push(35);
    // mjs.push(18);
    // mjs.push(36);
    // mjs.push(12);
    // mjs.push(37);
    // mjs.push(12);
    // for ( var i =0 ; i < mjs.length ; i++) {
    //     game.mahjongs[index] = mjs[i];
    //     index++;
    // }

}

function mopai(game,seatIndex) {
    if(game.currentIndex >= game.mahjongs.length){
        return -1;
    }
    //配合舟山补花逻辑 如果手牌里有花就先补花
    buhua(game,seatIndex);
    var data = game.gameSeats[seatIndex];
    var mahjongs = data.holds;
    var pai = game.mahjongs[game.currentIndex];
    //补花
    while (pai >= 34 && pai < 42) {
        //标记刚刚杠过
        data.ifJustGanged = 1;
        game.gameSeats[seatIndex].huas.push(pai);
        //通知有人抓到花
        userMgr.broacastInRoom('gethua_notify_push', {userid: data.userId, pai: pai}, data.userId, true);
        game.currentIndex++;
        pai = game.mahjongs[game.currentIndex];
    }
    mahjongs.push(pai);
    //每次摸牌都要把这个标记减一，用于判断杠上花
    data.ifJustGanged --;

    //统计牌的数目 ，用于快速判定（空间换时间）
    var c = data.countMap[pai];
    if(c == null) {
        c = 0;
    }
    data.countMap[pai] = c + 1;
    game.currentIndex ++;
    return pai;
}

function deal(game){
    //强制清0
    game.currentIndex = 0;

    //每人13张 一共 13*4 ＝ 52张 庄家多一张 53张
    var seatIndex = game.button;
    for(var i = 0; i < 52; ++i){
        var mahjongs = game.gameSeats[seatIndex].holds;
        if(mahjongs == null){
            mahjongs = [];
            game.gameSeats[seatIndex].holds = mahjongs;
        }
        mopaiforstart(game,seatIndex);
        seatIndex ++;
        seatIndex %= 4;

    }

    //庄家多摸最后一张
    mopaiforstart(game,game.button);

    //当前轮设置为庄家
    game.turn = game.button;
}

//检查是否可以碰
function checkCanPeng(game,seatData,targetPai) {
    var count = seatData.countMap[targetPai];
    if(count != null && count >= 2){
        seatData.canPeng = true;
    }
}

//检查是否可以吃
function checkCanChi(game,seatData,targetPai) {
    //当前出牌位置
    var turn = game.turn;
    //被检测位置
    var seat_index_now = seatData.seatIndex;
    //检测是否是下家（只有下家可以吃）
    if(turn == 3 && seat_index_now != 0) return;
    if(turn != 3 && seat_index_now != turn+1) return;

    var holds = seatData.holds;
    //判断某牌是否在手牌中的函数
    var ifHas = function(holds,pai,type){
        for(var i=0; i<holds.length; i++){
            if(type==0){
                if(pai==holds[i] && pai>=0 && pai<9 ) return true;
            }else if(type==1){
                if(pai==holds[i] && pai>=9 && pai<18 ) return true;
            }else if(type==2){
                if(pai==holds[i] && pai>=18 && pai<27 ) return true;
            }
        }
        return false;
    }
    //判断出牌的类型 同 万 条
    var type = getMJType(targetPai);
    //判断是否可以吃
    var aax = ifHas(holds,targetPai-2,type);
    var ax = ifHas(holds,targetPai-1,type);
    var xa = ifHas(holds,targetPai+1,type);
    var xaa = ifHas(holds,targetPai+2,type);
    console.log("the chupai is "+targetPai);
    console.log("this holds are ");
    console.log(holds);
    var chitype= {
        left     : false,    //XAA
        mid      : false,    //AXA
        right   : false     //AAX
    };
    if(aax && ax) {
        seatData.canChi = true;
        chitype.right = true;
    }
    if(ax && xa) {
        seatData.canChi = true;
        chitype.mid = true;
    }
    if(xa && xaa) {
        seatData.canChi = true;
        chitype.left = true;
    }
    seatData.chitype = chitype;

    if(seatData.canChi == true) buhua(game,seatData.seatIndex);

    return;
}

//检查是否可以点杠
function checkCanDianGang(game,seatData,targetPai){
    //检查玩家手上的牌
    //如果没有牌了，则不能再杠
    if(game.mahjongs.length <= game.currentIndex){
        return;
    }
    if(getMJType(targetPai) == seatData.que){
        return;
    }
    var count = seatData.countMap[targetPai];
    if(count != null && count >= 3){
        seatData.canGang = true;
        seatData.gangPai.push(targetPai);
        return;
    }
}

//检查是否可以暗杠
function checkCanAnGang(game,seatData){
    //如果没有牌了，则不能再杠
    if(game.mahjongs.length <= game.currentIndex){
        return;
    }

    for(var key in seatData.countMap){
        var pai = parseInt(key);
        if(getMJType(pai) != seatData.que){
            var c = seatData.countMap[key];
            if(c != null && c == 4){
                seatData.canGang = true;
                seatData.gangPai.push(pai);
            }
        }
    }
}

//检查是否可以弯杠(自己摸起来的时候)
function checkCanWanGang(game,seatData){
    //如果没有牌了，则不能再杠
    if(game.mahjongs.length <= game.currentIndex){
        return;
    }

    //从碰过的牌中选
    for(var i = 0; i < seatData.pengs.length; ++i){
        var pai = seatData.pengs[i];
        if(seatData.countMap[pai] == 1){
            seatData.canGang = true;
            seatData.gangPai.push(pai);
        }
    }
}

function checkCanHu(game,seatData,targetPai) {
    game.lastHuPaiSeat = -1;
    if(getMJType(targetPai) == seatData.que){
        return;
    }
    seatData.canHu = false;
    for(var k in seatData.tingMap){
        if(targetPai == k){
            seatData.canHu = true;
        }
    }
}

function clearAllOptions(game,seatData){
    var fnClear = function(sd){
        sd.canPeng = false;
        sd.canGang = false;
        sd.canChi = false;
        sd.gangPai = [];
        sd.canHu = false;
        sd.lastFangGangSeat = -1;
    }
    if(seatData){
        fnClear(seatData);
    }
    else{
        game.qiangGangContext = null;
        for(var i = 0; i < game.gameSeats.length; ++i){
            fnClear(game.gameSeats[i]);
        }
    }
}

//检查听牌
function checkCanTingPai(game,seatData){
    seatData.tingMap = {};

    //检查是否是七对 前提是没有碰，也没有杠 ，即手上拥有13张牌
    // if(seatData.holds.length == 13){
    //     //有5对牌
    //     var hu = false;
    //     var danPai = -1;
    //     var pairCount = 0;
    //     for(var k in seatData.countMap){
    //         var c = seatData.countMap[k];
    //         if( c == 2 || c == 3){
    //             pairCount++;
    //         }
    //         else if(c == 4){
    //             pairCount += 2;
    //         }
    //
    //         if(c == 1 || c == 3){
    //             //如果已经有单牌了，表示不止一张单牌，并没有下叫。直接闪
    //             if(danPai >= 0){
    //                 break;
    //             }
    //             danPai = k;
    //         }
    //     }
    //
    //     //检查是否有6对 并且单牌是不是目标牌
    //     if(pairCount == 6){
    //         //七对只能和一张，就是手上那张单牌
    //         //七对的番数＝ 2番+N个4个牌（即龙七对）
    //         seatData.tingMap[danPai] = {
    //             fan : 2,
    //             pattern : "7pairs"
    //         };
    //         //如果是，则直接返回咯
    //     }
    // }

    //检查是否是对对胡  由于四川麻将没有吃，所以只需要检查手上的牌
    //对对胡叫牌有两种情况
    //1、N坎 + 1张单牌
    //2、N-1坎 + 两对牌
    var singleCount = 0;
    var colCount = 0;
    var pairCount = 0;
    var arr = [];
    for(var k in seatData.countMap){
        var c = seatData.countMap[k];
        if(c == 1){
            singleCount++;
            arr.push(k);
        }
        else if(c == 2){
            pairCount++;
            arr.push(k);
        }
        else if(c == 3){
            colCount++;
        }
        else if(c == 4){
            //手上有4个一样的牌，在四川麻将中是和不了对对胡的 随便加点东西
            singleCount++;
            pairCount+=2;
        }
    }

    if((pairCount == 2 && singleCount == 0) || (pairCount == 0 && singleCount == 1) ){
        for(var i = 0; i < arr.length; ++ i){
            //对对胡1番
            var p = arr[i];
            if(seatData.tingMap[p] == null){
                seatData.tingMap[p] = {
                    //pattern:"duidui",
                    fan:1
                };
            }
        }
    }

    //检查是不是平胡
    if(seatData.que != 0){
        mjutils.checkTingPai(seatData,0,9);
    }

    if(seatData.que != 1){
        mjutils.checkTingPai(seatData,9,18);
    }

    if(seatData.que != 2){
        mjutils.checkTingPai(seatData,18,27);
    }

    mjutils.checkTingPai(seatData,28,34);
}

function getSeatIndex(userId){
    var seatIndex = roomMgr.getUserSeat(userId);
    if(seatIndex == null){
        return null;
    }
    return seatIndex;
}

function getGameByUserID(userId){
    var roomId = roomMgr.getUserRoom(userId);
    if(roomId == null){
        return null;
    }
    var game = games[roomId];
    return game;
}

function hasOperations(seatData){
    if(seatData.canGang || seatData.canPeng || seatData.canHu || seatData.canChi){
        return true;
    }
    return false;
}

function sendOperations(game,seatData,pai) {
    if(hasOperations(seatData)){
        if(pai == -1){
            pai = seatData.holds[seatData.holds.length - 1];
        }

        var data = {
            pai:pai,
            hu:seatData.canHu,
            peng:seatData.canPeng,
            gang:seatData.canGang,
            gangpai:seatData.gangPai,
            chi:seatData.canChi,
            chitype:seatData.chitype
        };

        //如果可以有操作，则进行操作
        userMgr.sendMsg(seatData.userId,'game_action_push',data);
        console.log("game_action_pushing");

        data.si = seatData.seatIndex;
    }
    else{
        userMgr.sendMsg(seatData.userId,'game_action_push');
    }
}

function moveToNextUser(game,nextSeat){
    game.fangpaoshumu = 0;
    //找到下一个没有和牌的玩家
    if(nextSeat == null){
        while(true){
            game.turn ++;
            game.turn %= 4;
            var turnSeat = game.gameSeats[game.turn];
            if(turnSeat.hued == false){
                return;
            }
        }
    }
    else{
        game.turn = nextSeat;
    }
}

function doUserMoPai(game){
    game.chuPai = -1;
    var turnSeat = game.gameSeats[game.turn];
    turnSeat.lastFangGangSeat = -1;
    turnSeat.guoHuFan = -1;
    var pai = mopai(game,game.turn);
    //牌摸完了，结束
    if(pai == -1){
        doGameOver(game,turnSeat.userId);
        return;
    }
    else{
        var numOfMJ = game.mahjongs.length - game.currentIndex;
        userMgr.broacastInRoom('mj_count_push',numOfMJ,turnSeat.userId,true);
    }

    recordGameAction(game,game.turn,ACTION_MOPAI,pai);

    //通知前端新摸的牌
    userMgr.sendMsg(turnSeat.userId,'game_mopai_push',pai);
    //检查是否可以暗杠或者胡
    //检查胡，直杠，弯杠
    checkCanAnGang(game,turnSeat);
    checkCanWanGang(game,turnSeat,pai);

    //检查看是否可以和
    checkCanHu(game,turnSeat,pai);

    //广播通知玩家出牌方
    turnSeat.canChuPai = true;
    userMgr.broacastInRoom('game_chupai_push',turnSeat.userId,turnSeat.userId,true);

    //通知玩家做对应操作
    sendOperations(game,turnSeat,game.chuPai);
}

function isSameType(type,arr){
    for(var i = 0; i < arr.length; ++i){
        var t = getMJType(arr[i]);
        if(type != -1 && type != t){
            return false;
        }
        type = t;
    }
    return true;
}

/*********************************************************************
 *
 * 盘局结束时的各种胡法判断 前提是手牌已经是能胡的牌
 *
 * ********************************************************************/
//判断是否为清一色
function isQingYiSe(gameSeatData){
    var type = getMJType(gameSeatData.holds[0]);

    //检查手上的牌
    if(isSameType(type,gameSeatData.holds) == false){
        return false;
    }

    //检查杠下的牌
    if(isSameType(type,gameSeatData.angangs) == false){
        return false;
    }
    if(isSameType(type,gameSeatData.wangangs) == false){
        return false;
    }
    if(isSameType(type,gameSeatData.diangangs) == false){
        return false;
    }
    //检查碰牌
    if(isSameType(type,gameSeatData.pengs) == false){
        return false;
    }
    //判断吃的情况
    var chis = [];
    gameSeatData.chis.forEach(function(pais){
        chis.push(pais[0]);
    });
    if(isSameType(type,chis) == false) {
        return false;
    }
    return true;
}

//判断混一色
function isHunYiSe(seatData){
    var all = [].concat(seatData.holds);
    all = all.concat(seatData.pengs);
    all = all.concat(seatData.pengs);
    all = all.concat(seatData.pengs);
    all = all.concat(seatData.angangs);
    all = all.concat(seatData.wangangs);
    all = all.concat(seatData.diangangs);
    all = all.concat(seatData.angangs);
    all = all.concat(seatData.wangangs);
    all = all.concat(seatData.diangangs);
    all = all.concat(seatData.angangs);
    all = all.concat(seatData.wangangs);
    all = all.concat(seatData.diangangs);
    all = all.concat(seatData.angangs);
    all = all.concat(seatData.wangangs);
    all = all.concat(seatData.diangangs);
    for (var i = 0 ; i < seatData.chis.length; i++){
        all = all.concat(seatData.chis[i]);
    }

    all.sort(function(a,b){
        return parseInt(a-b);
    });
    var type = getMJType(all[0]);
    if(type == 3){
        return false;
    }

    var isHasOther = false;
    for( var i = 0 ; i < all.length ; i++ ){
        var mjtype = getMJType(all[i]);
        if ( mjtype != 3 && mjtype != type){
            return false;
        }else if (mjtype == 3 ) {
            isHasOther = true;
        }
    }

    if(isHasOther) return true;
    else return false;
}

//判断是否听
function isTinged(seatData){
    for(var k in seatData.tingMap){
        return true;
    }
    return false;
}

//判断是否为排胡 TODO：换种判断方式
function isPaiHu(seatData){

    if (seatData.pengs.length > 0 ||
        seatData.angangs.length > 0 ||
        seatData.wangangs.length > 0 ||
        seatData.diangangs.length > 0 ) {
        return false;
    }
    //没有刻子
    var kanzi = seatData.kanzi;
    for (var i = 0 ; i < kanzi.length ; i++) {
        if(kanzi[i].length == 3 && kanzi[i][0] == kanzi[i][1]) {
            return false;
        }

        var nowseat = (seatData.seatIndex-seatData.game.button+4)%4;
        var nowfeng = 0;
        (nowseat==0)?nowfeng=30:{};
        (nowseat==1)?nowfeng=32:{};
        (nowseat==2)?nowfeng=31:{};
        (nowseat==3)?nowfeng=33:{};
        if(kanzi[i].length == 2 &&
            ((kanzi[i][0]>26 && kanzi[i][0]<30) || kanzi[i][0]==nowfeng)
        ){
            return false;
        }
    }

    return true;
}

//判断是否为对对胡
function isDuiDuiHu (seatData) {
    if (seatData.chis.length > 0) {
        return false;
    }
    //没有坎子
    var kanzi = seatData.kanzi;
    for (var i = 0 ; i < kanzi.length ; i++) {
        if(kanzi[i].length == 3 && kanzi[i][0] != kanzi[i][1]) {
            return false;
        }
    }
    return true;
}

//判断是否杠上花
function isGangShangHua (seatData) {
    if ( seatData.ifJustGanged == 0 && seatData.iszimo ) {
        return true;
    }
    return false;
}

//判斷坎
function isKan (seatData) {
    var kanzi = seatData.kanzi;
    var hupai = seatData.holds[seatData.holds.length-1];
    for (var i = 0 ; i < kanzi.length ; i++) {
        if(kanzi[i].length == 3 &&kanzi[i][1]==hupai && kanzi[i][0]!=hupai){
            return true;
        }
    }
    return false;
}

//判斷邊
function isBian (seatData) {
    var kanzi = seatData.kanzi;
    var hupai = seatData.holds[seatData.holds.length-1];

    for (var i = 0 ; i < kanzi.length ; i++) {
        if(kanzi[i].length == 3 && kanzi[i][0] != kanzi[i][1] ) {
            if(kanzi[i][2] == 2 && hupai == 2) return true;
            if(kanzi[i][2] == 11 && hupai == 11) return true;
            if(kanzi[i][2] == 20 && hupai == 20) return true;
            if(kanzi[i][0] == 6 && hupai == 6) return true;
            if(kanzi[i][0] == 15 && hupai == 15) return true;
            if(kanzi[i][0] == 24 && hupai == 24) return true;
        }
    }
    return false;
}

//判斷單
function isDan (seatData) {
    var kanzi = seatData.kanzi;
    var hupai = seatData.holds[seatData.holds.length-1];
    for (var i = 0 ; i < kanzi.length ; i++) {
        if(kanzi[i].length == 2 && kanzi[i][0] == hupai){
            return true;
        }
    }
    return false;
}

//判斷對到
function isDuidao (seatData) {
    var kanzi = seatData.kanzi;
    var hupai = seatData.holds[seatData.holds.length-1];
    for (var i = 0 ; i < kanzi.length ; i++) {
        if(kanzi[i].length == 3 && kanzi[i][0] == hupai && kanzi[i][1] == hupai){
            return true;
        }
    }
    return false;
}

/*********************************************************************
 *
 *
 *
 * ******************************************************************/

//Jonathan 新增函数 开发calculateResult 函数 方便测试
exports.calculateRes = function (game) {
    calculateResult(game);
    return game;
};

function calculateResult(game){

    var baseScore = game.conf.baseScore;
    var numOfHued = 0;
    for(var i = 0; i < game.gameSeats.length; ++i){
        if(game.gameSeats[i].hued == true){
            numOfHued++;
        }

        //初始化判定
        var thisseat = game.gameSeats[i];
        //排胡、对对胡、混一色、清一色、杠上花
        thisseat.paihu = false;
        thisseat.duiduihu = false;
        thisseat.hunyise = false;
        thisseat.qingyise = false;
        thisseat.gangshanghua = false;
        thisseat.kan = false;
        thisseat.bian = false;
        thisseat.dan = false;
        thisseat.duidao = false;
        thisseat.score = 0;
    }


    //计算每家的台数
    for(var i = 0; i < game.gameSeats.length; ++i){
        var sd = game.gameSeats[i];
        //统计杠的数目
        sd.numAnGang = sd.angangs.length;
        sd.numMingGang = sd.wangangs.length + sd.diangangs.length;
        sd.tai = -1;//负一表示不是胡的人 没有台数
        if(sd.hued == true) {
            //通过胡数算法找到他的坎子们
            sd.kanzi = [];
            mjutils.canHu(sd);
            var kanzi = sd.kanzi;
            console.log("KANZI:");
            console.log(kanzi);
            //如果是点杠胡 则算作自摸
            //标注被抢杠的人
            var beiqianggangindex = -1;
            if(sd.isQiangGangHu){
                sd.iszimo=true;
                for (var n = 0 ; n < 4 ; n++) {
                    var s = game.gameSeats[n];
                    for (var m = 0 ; m < s.actions.length ; m++) {
                        var na = s.actions[m];
                        (na.type == "beiqianggang") ? beiqianggangindex = n : {};
                    }
                }
            }

            if(isPaiHu(sd)) sd.paihu = true;
            if(isDuiDuiHu(sd)) sd.duiduihu = true;
            if(isQingYiSe(sd)) sd.qingyise = true;
            if(isHunYiSe(sd)) sd.hunyise = true;
            if(isGangShangHua(sd)) sd.gangshanghua = true;
            if(isKan(sd)) {sd.kan = true;sd.paihu = false;}
            if(isBian(sd)) {sd.bian = true;sd.paihu = false;}
            if(isDan(sd)) {sd.dan = true;sd.paihu = false;}
            if(isDuidao(sd)) sd.duidao = true;

            //如果是胡的人，又不是自摸，那就先去掉手牌里最后一个，到最后再加上
            var tpai = -1;
            if(sd.hued && !sd.iszimo){
                var tpai = sd.holds.pop();
                sd.countMap[tpai] --;
            }

            //定海麻将 只有胡的人算台数
            var TAI = 0 ;
            //当前风圈 0123 东南西北
            var nowfeng = game.roomInfo.fengxiang;
            // 0123 东南西北
            var nowseat = (i-game.button+4)%4;
            //中发白东南西北碰出杠出暗刻为一台
            //东、南、西、北坐着碰出杠出暗刻加一台
            sd.pengs.forEach(function(pai){
                ( pai >= 27 && pai <= 29 ) ? TAI++ : {};
                switch(pai) {
                    case 30: {(nowseat == 0 ) ? TAI++ : {};(nowfeng == 0 ) ? TAI++ : {};break;}
                    case 32: {(nowseat == 1 ) ? TAI++ : {};(nowfeng == 1 ) ? TAI++ : {};break;}
                    case 31: {(nowseat == 2 ) ? TAI++ : {};(nowfeng == 2 ) ? TAI++ : {};break;}
                    case 33: {(nowseat == 3 ) ? TAI++ : {};(nowfeng == 3 ) ? TAI++ : {};break;}
                }
            });
            sd.angangs.forEach(function(pai){
                ( pai >= 27 && pai <= 29 ) ? TAI++ : {};
                switch(pai) {
                    case 30: {(nowseat == 0 ) ? TAI++ : {};(nowfeng == 0 ) ? TAI++ : {};break;}
                    case 32: {(nowseat == 1 ) ? TAI++ : {};(nowfeng == 1 ) ? TAI++ : {};break;}
                    case 31: {(nowseat == 2 ) ? TAI++ : {};(nowfeng == 2 ) ? TAI++ : {};break;}
                    case 33: {(nowseat == 3 ) ? TAI++ : {};(nowfeng == 3 ) ? TAI++ : {};break;}
                }
            });
            sd.wangangs.forEach(function(pai){
                ( pai >= 27 && pai <= 29 ) ? TAI++ : {};
                switch(pai) {
                    case 30: {(nowseat == 0 ) ? TAI++ : {};(nowfeng == 0 ) ? TAI++ : {};break;}
                    case 32: {(nowseat == 1 ) ? TAI++ : {};(nowfeng == 1 ) ? TAI++ : {};break;}
                    case 31: {(nowseat == 2 ) ? TAI++ : {};(nowfeng == 2 ) ? TAI++ : {};break;}
                    case 33: {(nowseat == 3 ) ? TAI++ : {};(nowfeng == 3 ) ? TAI++ : {};break;}
                }
            });
            sd.diangangs.forEach(function(pai){
                ( pai >= 27 && pai <= 29 ) ? TAI++ : {};
                switch(pai) {
                    case 30: {(nowseat == 0 ) ? TAI++ : {};(nowfeng == 0 ) ? TAI++ : {};break;}
                    case 32: {(nowseat == 1 ) ? TAI++ : {};(nowfeng == 1 ) ? TAI++ : {};break;}
                    case 31: {(nowseat == 2 ) ? TAI++ : {};(nowfeng == 2 ) ? TAI++ : {};break;}
                    case 33: {(nowseat == 3 ) ? TAI++ : {};(nowfeng == 3 ) ? TAI++ : {};break;}
                }
            });
            for ( var n = 27 ; n < 29 ; n++) {
                (sd.countMap[n] >=3) ? TAI++ : {};
            }
            for ( var n = 30 ; n < 34 ; n++) {
                if(sd.countMap[n] >=3) {
                    switch(n) {
                        case 30: {(nowseat == 0 ) ? TAI++ : {};(nowfeng == 0 ) ? TAI++ : {};break;}
                        case 32: {(nowseat == 1 ) ? TAI++ : {};(nowfeng == 1 ) ? TAI++ : {};break;}
                        case 31: {(nowseat == 2 ) ? TAI++ : {};(nowfeng == 2 ) ? TAI++ : {};break;}
                        case 33: {(nowseat == 3 ) ? TAI++ : {};(nowfeng == 3 ) ? TAI++ : {};break;}
                    }
                }
            }


            //春夏秋冬，梅兰竹菊坐着为一台
            //春夏秋冬 或者 梅兰竹菊 全拿再加一台
            var seasons = 0;
            var flowers = 0;
            sd.huas.forEach(function(pai){
                switch(pai) {
                    case 34: {(nowseat == 0) ? TAI++ : {}; seasons++; break;}
                    case 35: {(nowseat == 1) ? TAI++ : {}; seasons++; break;}
                    case 36: {(nowseat == 2) ? TAI++ : {}; seasons++; break;}
                    case 37: {(nowseat == 3) ? TAI++ : {}; seasons++; break;}
                    case 38: {(nowseat == 0) ? TAI++ : {}; flowers++; break;}
                    case 39: {(nowseat == 1) ? TAI++ : {}; flowers++; break;}
                    case 41: {(nowseat == 2) ? TAI++ : {}; flowers++; break;}
                    case 40: {(nowseat == 3) ? TAI++ : {}; flowers++; break;}
                }
            });
            if(seasons > 3 || flowers > 3) TAI++;





            //判断是否对应大风 大风加一台
            var judgebigwind = function(nowfeng,nowseat,pai){
                var res= 0;
                switch (nowfeng) {
                    case 0: if(pai == 30)  res++; break;
                    case 1: if(pai == 32)  res++; break;
                    case 2: if(pai == 31)  res++; break;
                    case 3: if(pai == 33)  res++; break;
                }
                switch (nowseat) {
                    case 0: if(pai == 30)  res++; break;
                    case 1: if(pai == 32)  res++; break;
                    case 2: if(pai == 31)  res++; break;
                    case 3: if(pai == 33)  res++; break;
                }
                return res;
            };
            //特殊加成 对到 点炮 胡东南西北时候 做到就加台
            if ( sd.hued && !sd.iszimo && sd.duidao ) {
                var res = judgebigwind(nowfeng,nowseat,tpai);
                TAI += res;
            }



            //坎边单排胡
            if(sd.duidao || sd.kan || sd.dan || sd.bian ) TAI++;
            //
            if(TAI<1 && sd.paihu){
                TAI++;
            }else if(TAI>0 && sd.paihu){
                sd.paihu = false;
            }
            //自摸 一台
            if(sd.iszimo) TAI++;
            //杠开 一台
            if(sd.gangshanghua) TAI++;
            //对对胡
            if(sd.duiduihu) TAI+=2;
            //清一色
            if(sd.qingyise) TAI += 4;
            //混一色
            if(sd.hunyise) TAI +=2;

            console.log("4 tai="+TAI);

            //最多四台
            if(TAI > 4) TAI = 4;
            sd.tai = TAI;

            //如果是胡的人，又不是自摸，那就先去掉手牌里最后一个，到最后再加上,这里做再加上的操作
            if(sd.hued && !sd.iszimo){
                sd.holds.push(tpai);
                sd.countMap[tpai] ++;
            }
        }
    }



    //边家的位置 和 胡的人的位置
    var bianindex = [];
    var huedindex = 0;
    for(var i = 0; i < game.gameSeats.length; ++i){
        if(game.gameSeats[i].hued == true) {
            huedindex = i;
        }else if (game.gameSeats[i].hued != true) {
            bianindex.push(i);
        }
    }
    //计算胡的人的分数
    var seats = game.gameSeats;
    var huseat = seats[huedindex];
    //10算法
    if(game.conf.jiesuan==0) {
        if(huseat.iszimo) {
            switch(huseat.tai) {
                case 0: huseat.score = 0 ;  break;
                case 1: huseat.score = 12;  break;
                case 2: huseat.score = 18;  break;
                case 3: huseat.score = 24;  break;
                case 4: huseat.score = 30;  break;
            }
            if(!sd.isQiangGangHu) {
                //计算其余人的分数
                var s = huseat.score / 3;
                for (var n = 0; n < seats.length; n++) {
                    if (seats[n].hued != true) {
                        seats[n].score -= s;
                    }
                }
            }else{
                var s = huseat.score;
                seats[beiqianggangindex].score -= s;
            }
        }
        else{
            switch(huseat.tai) {
                case 0: huseat.score = 6 ; break;
                case 1: huseat.score = 8 ; break;
                case 2: huseat.score = 10 ; break;
                case 3: huseat.score = 14 ; break;
                case 4: huseat.score = 20; break;
            }
            for (var n = 0 ; n < seats.length ; n++) {
                if( seats[n].hued != true) {
                    if( game.fangpaoindex == n ) {
                        switch(huseat.tai) {
                            case 0:  seats[n].score -= 6 ; break;
                            case 1: seats[n].score -= 8 ; break;
                            case 2: seats[n].score -= 10 ; break;
                            case 3: seats[n].score -= 14 ; break;
                            case 4: seats[n].score -= 20; break;
                        }
                    }
                }
            }
        }
    }
    //25算法
    else if(game.conf.jiesuan==1) {
        if(huseat.iszimo) {
            switch(huseat.tai) {
                case 0: huseat.score = 0 ;  break;
                case 1: huseat.score = 30 ;  break;
                case 2: huseat.score = 45 ;  break;
                case 3: huseat.score = 60;  break;
                case 4: huseat.score = 75;  break;
            }
            if(!sd.isQiangGangHu) {
                //计算其余人的分数
                var s = huseat.score/3;
                for (var n = 0 ; n < seats.length ; n++) {
                    if( seats[n].hued != true) {
                        seats[n].score -= s;
                    }
                }
            }else{
                var s = huseat.score;
                seats[beiqianggangindex].score -= s;
            }
        }
        else{
            switch(huseat.tai) {
                case 0: huseat.score = 10 ; break;
                case 1: huseat.score = 15 ; break;
                case 2: huseat.score = 25 ; break;
                case 3: huseat.score = 30 ; break;
                case 4: huseat.score = 50; break;
            }
            for (var n = 0 ; n < seats.length ; n++) {
                if( seats[n].hued != true) {
                    if( game.fangpaoindex == n ) {
                        switch(huseat.tai) {
                            case 0:  seats[n].score -= 10 ; break;
                            case 1: seats[n].score -= 15 ; break;
                            case 2: seats[n].score -= 25 ; break;
                            case 3: seats[n].score -= 30 ; break;
                            case 4: seats[n].score -= 50; break;
                        }
                    }
                }
            }
        }
    }
    //50算法
    else if(game.conf.jiesuan==2) {
        if(huseat.iszimo) {
            switch(huseat.tai) {
                case 0: huseat.score = 0  ;  break;
                case 1: huseat.score = 60 ;  break;
                case 2: huseat.score = 90 ;  break;
                case 3: huseat.score = 120;  break;
                case 4: huseat.score = 150;  break;
            }
            if(!sd.isQiangGangHu) {
                //计算其余人的分数
                var s = huseat.score/3;
                for (var n = 0 ; n < seats.length ; n++) {
                    if( seats[n].hued != true) {
                        seats[n].score -= s;
                    }
                }
            }else{
                var s = huseat.score;
                seats[beiqianggangindex].score -= s;
            }
        }
        else{
            switch(huseat.tai) {
                case 0: huseat.score = 30 ; break;
                case 1: huseat.score = 40 ; break;
                case 2: huseat.score = 50 ; break;
                case 3: huseat.score = 70 ; break;
                case 4: huseat.score = 100; break;
            }
            for (var n = 0 ; n < seats.length ; n++) {
                if( seats[n].hued != true) {
                    if( game.fangpaoindex == n ) {
                        switch(huseat.tai) {
                            case 0:  seats[n].score -= 30 ; break;
                            case 1: seats[n].score -= 40 ; break;
                            case 2: seats[n].score -= 50 ; break;
                            case 3: seats[n].score -= 70 ; break;
                            case 4: seats[n].score -= 100; break;
                        }
                    }
                }
            }
        }
    }
    //120
    else if(game.conf.jiesuan==3) {
        if(huseat.iszimo) {
            switch(huseat.tai) {
                case 0: huseat.score = 0 ;  break;
                case 1: huseat.score = 120 ;  break;
                case 2: huseat.score = 150 ;  break;
                case 3: huseat.score = 210 ;  break;
                case 4: huseat.score = 360 ;  break;
            }
            if(!sd.isQiangGangHu) {
                //计算其余人的分数
                var s = huseat.score/3;
                for (var n = 0 ; n < seats.length ; n++) {
                    if( seats[n].hued != true) {
                        seats[n].score -= s;
                    }
                }
            }else{
                var s = huseat.score;
                seats[beiqianggangindex].score -= s;
            }
        }
        else{
            switch(huseat.tai) {
                case 0: huseat.score = 60  ; break;
                case 1: huseat.score = 70  ; break;
                case 2: huseat.score = 100 ; break;
                case 3: huseat.score = 140 ; break;
                case 4: huseat.score = 230 ; break;
            }
            for (var n = 0 ; n < seats.length ; n++) {
                if( seats[n].hued != true) {
                    if( game.fangpaoindex == n ) {
                        switch(huseat.tai) {
                            case 0:  seats[n].score -= 60 ; break;
                            case 1: seats[n].score -= 70 ; break;
                            case 2: seats[n].score -= 100 ; break;
                            case 3: seats[n].score -= 140 ; break;
                            case 4: seats[n].score -= 230; break;
                        }
                    }
                }
            }
        }
    }

    //记录所有人的三尺三碰状态
    for (var i = 0 ; i < 4 ; i ++) {
        var ns = game.gameSeats[i];
        console.log(ns.sanchisanpeng);
        for (var j = 0 ; j < 4 ; j ++) {
            if(ns.sanchisanpeng[j]>=3) {
                var nowzuo = ( j - game.button + 4) % 4 ;
                var str = "";
                switch (nowzuo) {
                    case 0 : ns.actions.push({type: "sanchisanpeng0"}); break;
                    case 1 : ns.actions.push({type: "sanchisanpeng1"}); break;
                    case 2 : ns.actions.push({type: "sanchisanpeng2"}); break;
                    case 3 : ns.actions.push({type: "sanchisanpeng3"}); break;
                }
            }
        }
    }
    //
    var isYipaoduoxiang = false;
    //一炮多响
    //如果没人放炮则不计算一炮多响
    if(!huseat.iszimo || beiqianggangindex!= -1) {
        //找到胡的牌
        var hupai = huseat.holds[huseat.holds.length - 1];
        //找到另外两个既不是放炮又不是胡的人
        var other = [];
        for (var i = 0; i < 4; i++) {
            if (i != huedindex && i != game.fangpaoindex && i!=beiqianggangindex) {
                other.push(i);

            }
        }
        //判断这两个人加上这个胡的牌是否能胡
        console.log("判断两人是否能胡");
        console.log(other);
        for (var i = 0; i < 4; i++) {
            if(!game.gameSeats[other[i]]) break;
            if(other[i]==huedindex) break;
            var seatData = game.gameSeats[other[i]];
            //加上胡的牌
            seatData.holds.push(hupai);
            seatData.countMap[hupai]++;
            console.log(seatData.holds);
            //判断是否能胡
            if (mjutils.canHu(seatData)) {
                seatData.actions.push({type: "hu"});
                seatData.hued = true;
                isYipaoduoxiang = true;
                //重新计算分数：
                //初始化判定
                //排胡、对对胡、混一色、清一色、杠上花
                seatData.paihu = false;
                seatData.duiduihu = false;
                seatData.hunyise = false;
                seatData.qingyise = false;
                seatData.gangshanghua = false;
                seatData.kan = false;
                seatData.bian = false;
                seatData.dan = false;
                seatData.duidao = false;
                seatData.score = 0;
                //统计杠的数目
                var sd = seatData;
                sd.numAnGang = sd.angangs.length;
                sd.numMingGang = sd.wangangs.length + sd.diangangs.length;
                sd.tai = -1;//负一表示不是胡的人 没有台数
                if (isPaiHu(sd)) sd.paihu = true;
                if (isDuiDuiHu(sd)) sd.duiduihu = true;
                if (isQingYiSe(sd)) sd.qingyise = true;
                if (isHunYiSe(sd)) sd.hunyise = true;
                if (isGangShangHua(sd)) sd.gangshanghua = true;
                if (isKan(sd)) {sd.kan = true;sd.paihu = false;}
                if (isBian(sd)) {sd.bian = true;sd.paihu = false;}
                if (isDan(sd)) {sd.dan = true;sd.paihu = false;}
                if (isDuidao(sd)) sd.duidao = true;

                //定海麻将 只有胡的人算台数
                var TAI = 0;
                //当前风圈 0123 东南西北
                var nowfeng = game.roomInfo.fengxiang;
                // 0123 东南西北
                var nowseat = (seatData.seatIndex + game.button) % 4;
                console.log("seatindex"+i);
                console.log(nowseat);
                //中发白东南西北碰出杠出暗刻为一台
                //东、南、西、北坐着碰出杠出暗刻加一台
                sd.pengs.forEach(function (pai) {
                    ( pai >= 27 && pai <= 29 ) ? TAI++ : {};
                    switch (pai) {
                        case 30: {
                            (nowseat == 0 ) ? TAI++ : {};
                            (nowfeng == 0 ) ? TAI++ : {};
                            break;
                        }
                        case 32: {
                            (nowseat == 1 ) ? TAI++ : {};
                            (nowfeng == 1 ) ? TAI++ : {};
                            break;
                        }
                        case 31: {
                            (nowseat == 2 ) ? TAI++ : {};
                            (nowfeng == 2 ) ? TAI++ : {};
                            break;
                        }
                        case 33: {
                            (nowseat == 3 ) ? TAI++ : {};
                            (nowfeng == 3 ) ? TAI++ : {};
                            break;
                        }
                    }
                });
                sd.angangs.forEach(function (pai) {
                    ( pai >= 27 && pai <= 29 ) ? TAI++ : {};
                    switch (pai) {
                        case 30: {
                            (nowseat == 0 ) ? TAI++ : {};
                            (nowfeng == 0 ) ? TAI++ : {};
                            break;
                        }
                        case 32: {
                            (nowseat == 1 ) ? TAI++ : {};
                            (nowfeng == 1 ) ? TAI++ : {};
                            break;
                        }
                        case 31: {
                            (nowseat == 2 ) ? TAI++ : {};
                            (nowfeng == 2 ) ? TAI++ : {};
                            break;
                        }
                        case 33: {
                            (nowseat == 3 ) ? TAI++ : {};
                            (nowfeng == 3 ) ? TAI++ : {};
                            break;
                        }
                    }
                });
                sd.wangangs.forEach(function (pai) {
                    ( pai >= 27 && pai <= 29 ) ? TAI++ : {};
                    switch (pai) {
                        case 30: {
                            (nowseat == 0 ) ? TAI++ : {};
                            (nowfeng == 0 ) ? TAI++ : {};
                            break;
                        }
                        case 32: {
                            (nowseat == 1 ) ? TAI++ : {};
                            (nowfeng == 1 ) ? TAI++ : {};
                            break;
                        }
                        case 31: {
                            (nowseat == 2 ) ? TAI++ : {};
                            (nowfeng == 2 ) ? TAI++ : {};
                            break;
                        }
                        case 33: {
                            (nowseat == 3 ) ? TAI++ : {};
                            (nowfeng == 3 ) ? TAI++ : {};
                            break;
                        }
                    }
                });
                sd.diangangs.forEach(function (pai) {
                    ( pai >= 27 && pai <= 29 ) ? TAI++ : {};
                    switch (pai) {
                        case 30: {
                            (nowseat == 0 ) ? TAI++ : {};
                            (nowfeng == 0 ) ? TAI++ : {};
                            break;
                        }
                        case 32: {
                            (nowseat == 1 ) ? TAI++ : {};
                            (nowfeng == 1 ) ? TAI++ : {};
                            break;
                        }
                        case 31: {
                            (nowseat == 2 ) ? TAI++ : {};
                            (nowfeng == 2 ) ? TAI++ : {};
                            break;
                        }
                        case 33: {
                            (nowseat == 3 ) ? TAI++ : {};
                            (nowfeng == 3 ) ? TAI++ : {};
                            break;
                        }
                    }
                });
                for (var n = 27; n < 29; n++) {
                    (sd.countMap[n] >= 3) ? TAI++ : {};
                }
                for (var n = 30; n < 34; n++) {
                    if (sd.countMap[n] >= 3) {
                        switch (n) {
                            case 30: {
                                (nowseat == 0 ) ? TAI++ : {};
                                (nowfeng == 0 ) ? TAI++ : {};
                                break;
                            }
                            case 32: {
                                (nowseat == 1 ) ? TAI++ : {};
                                (nowfeng == 1 ) ? TAI++ : {};
                                break;
                            }
                            case 31: {
                                (nowseat == 2 ) ? TAI++ : {};
                                (nowfeng == 2 ) ? TAI++ : {};
                                break;
                            }
                            case 33: {
                                (nowseat == 3 ) ? TAI++ : {};
                                (nowfeng == 3 ) ? TAI++ : {};
                                break;
                            }
                        }
                    }
                }

                //春夏秋冬，梅兰竹菊坐着为一台
                //春夏秋冬 或者 梅兰竹菊 全拿再加一台
                var seasons = 0;
                var flowers = 0;
                sd.huas.forEach(function(pai){
                    switch(pai) {
                        case 34: {(nowseat == 0) ? TAI++ : {}; seasons++; break;}
                        case 35: {(nowseat == 1) ? TAI++ : {}; seasons++; break;}
                        case 36: {(nowseat == 2) ? TAI++ : {}; seasons++; break;}
                        case 37: {(nowseat == 3) ? TAI++ : {}; seasons++; break;}
                        case 38: {(nowseat == 0) ? TAI++ : {}; flowers++; break;}
                        case 39: {(nowseat == 1) ? TAI++ : {}; flowers++; break;}
                        case 41: {(nowseat == 2) ? TAI++ : {}; flowers++; break;}
                        case 40: {(nowseat == 3) ? TAI++ : {}; flowers++; break;}
                    }
                });
                if(seasons > 3 || flowers > 3) TAI++;


                //坎边单排胡
                if(sd.duidao || sd.kan || sd.dan || sd.bian) TAI++;

                //
                if(TAI<1 && sd.paihu){
                    TAI++;
                }else if(TAI>0 && sd.paihu){
                    sd.paihu = false;
                }
                //自摸 一台
                if(sd.iszimo) TAI++;
                //杠开 一台
                if(sd.gangshanghua) TAI++;
                //对对胡
                if(sd.duiduihu) TAI+=2;
                //清一色
                if(sd.qingyise) TAI += 4;
                //混一色
                if(sd.hunyise) TAI +=2;

                //最多四台
                if (TAI > 4) TAI = 4;
                sd.tai = TAI;


                var huseat = seatData;

                //10算法
                if(game.conf.jiesuan==0) {
                    switch(huseat.tai) {
                        case 0: huseat.score += 6 ; break;
                        case 1: huseat.score += 8 ; break;
                        case 2: huseat.score += 10 ; break;
                        case 3: huseat.score += 14 ; break;
                        case 4: huseat.score += 20; break;
                    }
                    for (var n = 0 ; n < seats.length ; n++) {
                        if( seats[n].hued != true) {
                            if( game.fangpaoindex == n ) {
                                switch(huseat.tai) {
                                    case 0:  seats[n].score -= 6 ; break;
                                    case 1: seats[n].score -= 8 ; break;
                                    case 2: seats[n].score -= 10 ; break;
                                    case 3: seats[n].score -= 14 ; break;
                                    case 4: seats[n].score -= 20; break;
                                }
                            }
                        }
                        if( beiqianggangindex == n ) {
                            switch(huseat.tai) {
                                case 0: seats[n].score -= 6 ; break;
                                case 1: seats[n].score -= 8 ; break;
                                case 2: seats[n].score -= 10 ; break;
                                case 3: seats[n].score -= 14 ; break;
                                case 4: seats[n].score -= 20; break;
                            }
                        }
                    }

                }
                //25算法
                else if(game.conf.jiesuan==1) {
                    switch(huseat.tai) {
                        case 0: huseat.score += 10 ; break;
                        case 1: huseat.score += 15 ; break;
                        case 2: huseat.score += 25 ; break;
                        case 3: huseat.score += 30 ; break;
                        case 4: huseat.score += 50 ; break;
                    }
                    for (var n = 0 ; n < seats.length ; n++) {
                            if( seats[n].hued != true) {
                                if( game.fangpaoindex == n ) {
                                    switch(huseat.tai) {
                                        case 0: seats[n].score -= 10 ; break;
                                        case 1: seats[n].score -= 15 ; break;
                                        case 2: seats[n].score -= 25 ; break;
                                        case 3: seats[n].score -= 30 ; break;
                                        case 4: seats[n].score -= 50; break;
                                    }
                                }
                                if( beiqianggangindex == n ) {
                                    switch(huseat.tai) {
                                        case 0: seats[n].score -= 10 ; break;
                                        case 1: seats[n].score -= 15 ; break;
                                        case 2: seats[n].score -= 25 ; break;
                                        case 3: seats[n].score -= 30 ; break;
                                        case 4: seats[n].score -= 50; break;
                                    }
                                }
                            }
                        }
                }
                //50算法
                else if(game.conf.jiesuan==2) {
                    switch(huseat.tai) {
                        case 0: huseat.score += 30 ; break;
                        case 1: huseat.score += 40 ; break;
                        case 2: huseat.score += 50 ; break;
                        case 3: huseat.score += 70 ; break;
                        case 4: huseat.score += 100; break;
                    }
                    for (var n = 0 ; n < seats.length ; n++) {
                            if( seats[n].hued != true) {
                                if( game.fangpaoindex == n ) {
                                    switch(huseat.tai) {
                                        case 0:  seats[n].score -= 30 ; break;
                                        case 1: seats[n].score -= 40 ; break;
                                        case 2: seats[n].score -= 50 ; break;
                                        case 3: seats[n].score -= 70 ; break;
                                        case 4: seats[n].score -= 100; break;
                                    }
                                }
                                if( beiqianggangindex == n ) {
                                    switch(huseat.tai) {
                                        case 0: seats[n].score -= 30 ; break;
                                        case 1: seats[n].score -= 40 ; break;
                                        case 2: seats[n].score -= 50 ; break;
                                        case 3: seats[n].score -= 70 ; break;
                                        case 4: seats[n].score -= 100; break;
                                    }
                                }
                            }
                        }
                }
                //120
                else if(game.conf.jiesuan==3) {
                    switch(huseat.tai) {
                        case 0: huseat.score += 60  ; break;
                        case 1: huseat.score += 70  ; break;
                        case 2: huseat.score += 100 ; break;
                        case 3: huseat.score += 140 ; break;
                        case 4: huseat.score += 230 ; break;
                    }
                    for (var n = 0 ; n < seats.length ; n++) {
                        if( seats[n].hued != true) {
                            if( game.fangpaoindex == n ) {
                                switch(huseat.tai) {
                                    case 0:  seats[n].score -= 60 ; break;
                                    case 1: seats[n].score -= 70 ; break;
                                    case 2: seats[n].score -= 100 ; break;
                                    case 3: seats[n].score -= 140 ; break;
                                    case 4: seats[n].score -= 230; break;
                                }
                            }
                            if(beiqianggangindex == n ) {
                                switch(huseat.tai) {
                                    case 0:  seats[n].score -= 60 ; break;
                                    case 1: seats[n].score -= 70 ; break;
                                    case 2: seats[n].score -= 100 ; break;
                                    case 3: seats[n].score -= 140 ; break;
                                    case 4: seats[n].score -= 230; break;
                                }
                            }
                        }
                    }
                }

            } else {
                seatData.holds.pop();
                seatData.countMap[hupai]--;
            }
        }
    }

    // if(!isYipaoduoxiang) {
    //     //三吃三碰
    //     if (huseat.iszimo) {
    //
    //         console.log("自摸");
    //
    //         var base = huseat.score / 3;
    //         //所有与胡的人有三尺三碰关系的人 都加三倍
    //         for (var i = 0; i < 4; i++) {
    //             if (i != huedindex) {
    //                 if (seats[i].sanchisanpeng[huedindex] > 2
    //                     || seats[huedindex].sanchisanpeng[i] > 2) {
    //                     if (huseat.gangshanghua) {
    //                         huseat.score += base * 5;
    //                         seats[i].score -= base * 5;
    //                     } else {
    //                         huseat.score += base * 2;
    //                         seats[i].score -= base * 2;
    //                     }
    //                 }
    //             }
    //         }
    //     } else {
    //         var base = huseat.score;
    //         //所有与胡的人有三尺三碰关系的人 都扣一倍分数
    //         for (var i = 0; i < 4; i++) {
    //             if (i != huedindex) {
    //                 if (seats[i].sanchisanpeng[huedindex] > 2
    //                     || seats[huedindex].sanchisanpeng[i] > 2) {
    //                     huseat.score += base;
    //                     seats[i].score -= base;
    //                 }
    //             }
    //         }
    //     }
    // }
    // else {

    //计算三尺三碰
    var base = [];
    (game.gameSeats[0].iszimo) ? base[0] = game.gameSeats[0].score/3 : base[0] = game.gameSeats[0].score;
    (game.gameSeats[1].iszimo) ? base[1] = game.gameSeats[1].score/3 : base[1] = game.gameSeats[1].score;
    (game.gameSeats[2].iszimo) ? base[2] = game.gameSeats[2].score/3 : base[2] = game.gameSeats[2].score;
    (game.gameSeats[3].iszimo) ? base[3] = game.gameSeats[3].score/3 : base[3] = game.gameSeats[3].score;
    for(var i = 0 ; i < 4 ; i++) {
        var ns = game.gameSeats[i];
        if(ns.hued) {
            for ( var j = 0 ; j < 4 ; j++) {
                if(ns.sanchisanpeng[j]>2){
                    var poorguy = game.gameSeats[j];
                    if(ns.gangshanghua){
                        ns.score += base[i] * 6;
                        poorguy.score -= base[i] * 6;
                    }else if(ns.iszimo){
                        ns.score += base[i] * 3;
                        poorguy.score -= base[i] * 3;
                    }
                    // else if(ns.isQiangGangHu) {
                    //     ns.score += base[i] * 2;
                    //     poorguy.score -= base[i] * 2;
                    // }
                    else{
                        ns.score += base[i];
                        poorguy.score -= base[i];
                    }
                }
            }
            for ( var j = 0 ; j < 4 ; j++) {
                if(game.gameSeats[j].sanchisanpeng[i]>2){
                    var poorguy = game.gameSeats[j];
                    if(ns.gangshanghua){
                        ns.score += base[i] * 5;
                        poorguy.score -= base[i] * 5;
                    }else if(ns.iszimo){
                        ns.score += base[i] * 3;
                        poorguy.score -= base[i] * 3;
                    }
                    // else if(ns.isQiangGangHu) {
                    //     ns.score += base[i] * 2;
                    //     poorguy.score -= base[i] * 2;
                    // }
                    else{
                        ns.score += base[i];
                        poorguy.score -= base[i];
                    }
                }
            }
        }
    }

    //抢杠胡
    if(beiqianggangindex>=0) {
        var bqg = game.gameSeats[beiqianggangindex];
        for (var i = 0; i < 4; i++) {
            var ns = game.gameSeats[i];
            if (ns.hued) {
                bqg.score -= base[i] * 2;
                ns.score += base[i] * 2;
            }
        }
    }


}

function doGameOver(game,userId,forceEnd){
    var roomId = roomMgr.getUserRoom(userId);
    if(roomId == null){
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return;
    }

    var results = [];
    var dbresult = [0,0,0,0];

    var fnNoticeResult = function(isEnd){
        var endinfo = null;
        if(isEnd){
            endinfo = [];
            for(var i = 0; i < roomInfo.seats.length; ++i){
                var rs = roomInfo.seats[i];
                endinfo.push({
                    numzimo:rs.numZiMo,
                    numjiepao:rs.numJiePao,
                    numdianpao:rs.numDianPao,
                    numangang:rs.numAnGang,
                    numminggang:rs.numMingGang,
                    numchadajiao:rs.numChaJiao,
                });
            }
        }
        userMgr.broacastInRoom('game_over_push',{results:results,endinfo:endinfo},userId,true);
        //如果局数已够，则进行整体结算，并关闭房间
        if(isEnd){
            setTimeout(function(){
                if (roomInfo.numOfGames > 1) {
                    store_history(roomInfo);
                }

                userMgr.kickAllInRoom(roomId);
                roomMgr.destroy(roomId);


                db.archive_games(roomInfo.uuid);
            },1500);
        }
    };

    if(game != null){
        if(!forceEnd){
            //记录改局
            db.save_gamecp(game);
            calculateResult(game,roomInfo);
        }

        for(var i = 0; i < roomInfo.seats.length; ++i){
            var rs = roomInfo.seats[i];
            var sd = game.gameSeats[i];


            //rs为全局数据 sd为当前局数据 需要做加法。TODO：逻辑写完以后这里都需要加上
            rs.ready = false;
            rs.score += sd.score;
            (sd.iszimo) ? rs.numZiMo ++ :{};
            (sd.hued && !sd.iszimo) ? rs.numJiePao ++ : {};
            (game.fangpaoindex == sd.seatIndex) ? rs.numDianPao ++ : {} ;
            rs.numAnGang += sd.angangs.length;
            rs.numMingGang += sd.diangangs.length + sd.wangangs.length;

            var userRT = {
                userId:sd.userId,
                pengs:sd.pengs,
                chis:sd.chis,
                huas:sd.huas,
                actions:[],
                wangangs:sd.wangangs,
                diangangs:sd.diangangs,
                angangs:sd.angangs,
                numofgen:sd.numofgen,
                holds:sd.holds,
                tai:sd.tai,
                score:sd.score,
                totalscore:rs.score,
                qingyise:sd.qingyise,
                paihu :sd.paihu,
                duiduihu:sd.duiduihu,
                hunyise:sd.hunyise,
                gangshanghua:sd.gangshanghua,
                kan:sd.kan,
                bian:sd.bian,
                dan:sd.dan,
                duidao:sd.duidao,
                pattern:sd.pattern,
                isganghu:sd.isGangHu,
                menqing:sd.isMenQing,
                zhongzhang:sd.isZhongZhang,
                jingouhu:sd.isJinGouHu,
                haidihu:sd.isHaiDiHu,
                tianhu:sd.isTianHu,
                dihu:sd.isDiHu,
                huorder:game.hupaiList.indexOf(i),

                //舟山麻将需要发送当前局数 和 圈数
                gameindex:game.gameIndex,
                fengxiang:game.conf.fengxiang,
            };

            //推入庄
            if(roomInfo.nextButton == i){
                userRT.button = true ;
            }else{
                userRT.button = false ;
            }

            for(var k in sd.actions){
                userRT.actions[k] = {
                    type:sd.actions[k].type,
                };
            }
            results.push(userRT);


            dbresult[i] = sd.score;
            delete gameSeatsOfUsers[sd.userId];
        }
        delete games[roomId];

        var old = roomInfo.nextButton;
        //正常的庄家逻辑 、谁赢谁做庄
        // if(game.yipaoduoxiang >= 0){
        //     roomInfo.nextButton = game.yipaoduoxiang;
        // }
        // else if(game.firstHupai >= 0){
        //     roomInfo.nextButton = game.firstHupai;
        // }
        // else{
        //     roomInfo.nextButton = (game.turn + 1) % 4;
        // }
        //沈家门庄家逻辑 庄家不赢就给下一家坐庄。
        var quanshu = game.conf.quanshu;
        //判断有没有打完一个风向，打完则改变风向


        //判斷是否打完一局
        var isEnd = false;

        //風圈 風向變化
        if(game.firstHupai != old && game.firstHupai!=-1) {
            roomInfo.nextButton = (old + 1) % 4;
            if(roomInfo.nextButton==roomInfo.beginButton){
                roomInfo.fengxiang = (roomInfo.fengxiang+1)%4;
            }
        }

        //如果打一圈：
        if(quanshu==1) {
            if(game.firstHupai != old && roomInfo.nextButton==roomInfo.beginButton && roomInfo.fengxiang==0) isEnd = true;
        }
        //如果打8局
        else if(quanshu==0){
            if(game.firstHupai != old && roomInfo.nextButton==roomInfo.beginButton && roomInfo.fengxiang==2) isEnd = true;
        }

        roomInfo.numOfGames++;

        if(old != roomInfo.nextButton){
            db.update_next_button(roomId,roomInfo.nextButton);
        }
    }





    if(forceEnd || game == null){
        fnNoticeResult(true);
    }
    else{
        //保存游戏
        store_game(game,function(ret){

            db.update_game_result(roomInfo.uuid,game.gameIndex,dbresult);

            //记录打牌信息
            var str = JSON.stringify(game.actionList);
            db.update_game_action_records(roomInfo.uuid,game.gameIndex,str);

            //保存游戏局数
            db.update_num_of_turns(roomId,roomInfo.numOfGames);

            //保存游戏风向
            db.update_fengxiang(roomId,roomInfo.fengxiang);

            //保存开始的庄
            db.update_begin_button(roomId,roomInfo.beginButton);

            //扣除鑽石
            if(roomInfo.ifPayed == false) {
                roomInfo.ifPayed = true;
                //房主出資 8盤為3鉆 一圈為6鉆； 玩家平分 8盤每位1鉆 一圈每位2鉆
                //房主出資
                if (roomInfo.conf.koufei == 0) {
                    //8盤 房主扣3鉆
                    if (roomInfo.conf.quanshu == 0) {
                        db.cost_gems(roomInfo.conf.creator, 3);
                    }
                    //一圈
                    if (roomInfo.conf.quanshu == 1) {
                        db.cost_gems(roomInfo.conf.creator, 6);
                    }
                }
                //玩家平分
                else if (roomInfo.conf.koufei == 1) {
                    //8盤 每位1鉆
                    if (roomInfo.conf.quanshu == 0) {
                        for (var i = 0; i < 4; i++) {
                            db.cost_gems(game.gameSeats[i].userId, 1);
                        }
                    }
                    //一圈 每位2鉆
                    if (roomInfo.conf.quanshu == 1) {
                        for (var i = 0; i < 4; i++) {
                            db.cost_gems(game.gameSeats[i].userId, 2);
                        }
                    }
                }
            }

            //var isEnd = (roomInfo.numOfGames >= roomInfo.conf.maxGames);
            fnNoticeResult(isEnd);
        });
    }
}

function recordUserAction(game,seatData,type,target){
    var d = {type:type,targets:[]};
    if(target != null){
        if(typeof(target) == 'number'){
            d.targets.push(target);
        }
        else{
            d.targets = target;
        }
    }
    else{
        for(var i = 0; i < game.gameSeats.length; ++i){
            var s = game.gameSeats[i];
            if(i != seatData.seatIndex && s.hued == false){
                d.targets.push(i);
            }
        }
    }

    seatData.actions.push(d);
    return d;
}

function recordGameAction(game,si,action,pai,other){
    game.actionList.push(si);
    game.actionList.push(action);
    if(pai != null){
        game.actionList.push(pai);
    }
    if(other != null){
        game.actionList.push([].concat(other));
    }
}

exports.setReady = function(userId,callback){
    var roomId = roomMgr.getUserRoom(userId);
    if(roomId == null){
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return;
    }

    roomMgr.setReady(userId,true);

    var game = games[roomId];
    if(game == null){
        if(roomInfo.seats.length == 4){
            for(var i = 0; i < roomInfo.seats.length; ++i){
                var s = roomInfo.seats[i];
                if(s.ready == false || userMgr.isOnline(s.userId)==false){
                    return;
                }
            }
            //4个人到齐了，并且都准备好了，则开始新的一局
            exports.begin(roomId);
        }
    }
    else{
        var numOfMJ = game.mahjongs.length - game.currentIndex;
        var remainingGames = roomInfo.conf.maxGames - roomInfo.numOfGames;

        var data = {
            fengxiang:roomInfo.fengxiang,
            state:game.state,
            numofmj:numOfMJ,
            button:game.button,
            turn:game.turn,
            chuPai:game.chuPai,
            huanpaimethod:game.huanpaiMethod
        };

        data.seats = [];
        var seatData = null;
        for(var i = 0; i < 4; ++i){
            var sd = game.gameSeats[i];


            var s = {
                userid:sd.userId,
                folds:sd.folds,
                angangs:sd.angangs,
                chis:sd.chis,
                huas:sd.huas,
                diangangs:sd.diangangs,
                wangangs:sd.wangangs,
                pengs:sd.pengs,
                que:sd.que,
                hued:sd.hued,
                iszimo:sd.iszimo,
            }
            if(sd.userId == userId){
                s.holds = sd.holds;
                s.huanpais = sd.huanpais;
                seatData = sd;
            }
            else{
                s.huanpais = sd.huanpais? []:null;
            }
            data.seats.push(s);
        }

        //同步整个信息给客户端
        userMgr.sendMsg(userId,'game_sync_push',data);
        sendOperations(game,seatData,game.chuPai);
    }
}

function store_single_history(userId,history){
    db.get_user_history(userId,function(data){
        if(data == null){
            data = [];
        }
        while(data.length >= 10){
            data.shift();
        }
        data.push(history);
        db.update_user_history(userId,data);
    });
}

function store_history(roomInfo){
    var seats = roomInfo.seats;
    var history = {
        uuid:roomInfo.uuid,
        id:roomInfo.id,
        time:roomInfo.createTime,
        seats:new Array(4)
    };

    for(var i = 0; i < seats.length; ++i){
        var rs = seats[i];
        var hs = history.seats[i] = {};
        hs.userid = rs.userId;
        hs.name = crypto.toBase64(rs.name);
        hs.score = rs.score;
    }

    for(var i = 0; i < seats.length; ++i){
        var s = seats[i];
        store_single_history(s.userId,history);
    }
}

function construct_game_base_info(game){
    var baseInfo = {
        type:game.conf.type,
        button:game.button,
        index:game.gameIndex,
        mahjongs:game.mahjongs,
        game_seats:new Array(4)
    }

    for(var i = 0; i < 4; ++i){
        baseInfo.game_seats[i] = game.gameSeats[i].holds;
    }
    game.baseInfoJson = JSON.stringify(baseInfo);
}

function store_game(game,callback){
    db.create_game(game.roomInfo.uuid,game.gameIndex,game.baseInfoJson,callback);
}

function checkCanQiangGang(game,turnSeat,seatData,pai){
    var hasActions = false;
    for(var i = 0; i < game.gameSeats.length; ++i){
        //杠牌者不检查
        if(seatData.seatIndex == i){
            continue;
        }
        var ddd = game.gameSeats[i];
        //已经和牌的不再检查
        if(ddd.hued){
            continue;
        }

        checkCanHu(game,ddd,pai);
        if(ddd.canHu){
            sendOperations(game,ddd,pai);
            hasActions = true;
        }
    }
    if(hasActions){
        game.qiangGangContext = {
            turnSeat:turnSeat,
            seatData:seatData,
            pai:pai,
            isValid:true,
        }
    }
    else{
        game.qiangGangContext = null;
    }
    return game.qiangGangContext != null;
}

function doGang(game,turnSeat,seatData,gangtype,numOfCnt,pai){
    var seatIndex = seatData.seatIndex;
    var gameTurn = turnSeat.seatIndex;

    var isZhuanShouGang = false;
    if(gangtype == "wangang"){
        var idx = seatData.pengs.indexOf(pai);
        if(idx >= 0){
            seatData.pengs.splice(idx,1);
        }

        //如果最后一张牌不是杠的牌，则认为是转手杠
        if(seatData.holds[seatData.holds.length - 1] != pai){
            isZhuanShouGang = true;
        }
    }
    //进行碰牌处理
    //扣掉手上的牌
    //从此人牌中扣除
    for(var i = 0; i < numOfCnt; ++i){
        var index = seatData.holds.indexOf(pai);
        if(index == -1){
            console.log("can't find mj.");
            return;
        }
        seatData.holds.splice(index,1);
        seatData.countMap[pai] --;
    }

    recordGameAction(game,seatData.seatIndex,ACTION_GANG,pai);

    //记录下玩家的杠牌
    if(gangtype == "angang"){
        seatData.angangs.push(pai);
        var ac = recordUserAction(game,seatData,"angang");
        ac.score = game.conf.baseScore*2;
    }
    else if(gangtype == "diangang"){
        seatData.diangangs.push(pai);
        var ac = recordUserAction(game,seatData,"diangang",gameTurn);
        ac.score = game.conf.baseScore*2;
        var fs = turnSeat;
        recordUserAction(game,fs,"fanggang",seatIndex);
    }
    else if(gangtype == "wangang"){
        seatData.wangangs.push(pai);
        if(isZhuanShouGang == false){
            var ac = recordUserAction(game,seatData,"wangang");
            ac.score = game.conf.baseScore;
        }
        else{
            recordUserAction(game,seatData,"zhuanshougang");
        }
    }

    checkCanTingPai(game,seatData);
    //通知其他玩家，有人杠了牌
    userMgr.broacastInRoom('gang_notify_push',{userid:seatData.userId,pai:pai,gangtype:gangtype},seatData.userId,true);

    //变成自己的轮子
    moveToNextUser(game,seatIndex);
    //标记刚刚杠过
    seatData.ifJustGanged = 1;
    //再次摸牌
    doUserMoPai(game);

    //只能放在这里。因为过手就会清除杠牌标记
    seatData.lastFangGangSeat = gameTurn;
}

/***********************************************************************
 *
 *  客户端发送事件侦听
 *
 * ********************************************************************/

//开始新的一局
exports.begin = function(roomId) {
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return;
    }
    var seats = roomInfo.seats;

    (roomInfo.numOfGames == 0 ) ? roomInfo.numOfGames = 1 : {} ;

    var game = {
        conf:roomInfo.conf,
        roomInfo:roomInfo,
        gameIndex:roomInfo.numOfGames,
        button:roomInfo.nextButton,
        mahjongs:new Array(144),
        currentIndex:0,
        gameSeats:new Array(4),
        numOfQue:0,
        turn:0,
        chuPai:-1,
        state:"idle",
        firstHupai:-1,
        yipaoduoxiang:-1,
        fangpaoshumu:-1,
        actionList:[],
        hupaiList:[],
        chupaiCnt:0,
        fangpaoindex:-1,
    };

    //roomInfo.numOfGames++;

    for(var i = 0; i < 4; ++i){
        var data = game.gameSeats[i] = {};
        data.game = game;
        data.seatIndex = i;
        data.userId = seats[i].userId;
        //持有的牌
        data.holds= [];
        //打出的牌
        data.folds = [];
        //暗杠的牌
        data.angangs = [];
        //点杠的牌
        data.diangangs = [];
        //弯杠的牌
        data.wangangs = [];
        //碰了的牌
        data.pengs  = [];
        //吃了的牌
        data.chis   =   [];
        //拿到的花
        data.huas = [];
        //缺一门
        data.que = -1;
        //是否刚刚杠过 (用于判断杠上花) 杠时会被重置为1，每次摸牌-1，如果胡的时候是0，则表示是杠上花
        data.ifJustGanged = -1;
        //换三张的牌
        data.huanpais = null;
        //玩家手上的牌的数目，用于快速判定碰杠
        data.countMap = {};
        //玩家听牌，用于快速判定胡了的番数
        data.tingMap = {};
        data.pattern = "";
        //是否可以杠
        data.canGang = false;
        //用于记录玩家可以杠的牌
        data.gangPai = [];
        //是否可以碰
        data.canPeng = false;
        //是否可以胡
        data.canHu = false;
        //是否可以吃
        data.canChi = false;
        //吃牌类型
        data.chitype = {
            left : false,
            mid : false,
            right : false
        };
        //是否可以出牌
        data.canChuPai = false;
        //记录所有坎子
        data.kanzi = [];
        //如果guoHuFan >=0 表示处于过胡状态，
        //如果过胡状态，那么只能胡大于过胡番数的牌
        data.guoHuFan = -1;

        //是否胡了
        data.hued = false;
        //是否是自摸
        data.iszimo = false;

        data.isGangHu = false;

        //
        data.actions = [];

        //台数 分数
        data.tai = 0;
        data.score = 0;
        data.lastFangGangSeat = -1;

        //定海麻将特有 用于判断三吃三碰 分别为座位是 0，1,2,3的人碰杠自己的次数
        data.sanchisanpeng = [0,0,0,0];

        //统计信息
        data.numZiMo = 0;
        data.numJiePao = 0;
        //需要留着，记录是否点炮
        data.numDianPao = 0;
        data.numAnGang = 0;
        data.numMingGang = 0;
        data.numChaJiao = 0;

        gameSeatsOfUsers[data.userId] = data;
    }
    games[roomId] = game;
    //洗牌
    shuffle(game);
    //发牌
    deal(game);

    var numOfMJ = game.mahjongs.length - game.currentIndex;

    for(var i = 0; i < seats.length; ++i){
        //开局时，通知前端必要的数据
        var s = seats[i];
        //通知玩家手牌
        userMgr.sendMsg(s.userId,'game_holds_push',game.gameSeats[i].holds);
        //通知还剩多少张牌
        userMgr.sendMsg(s.userId,'mj_count_push',numOfMJ);
        //通知还剩多少局
        userMgr.sendMsg(s.userId,'game_num_push',roomInfo.numOfGames);
        //通知游戏开始
        userMgr.sendMsg(s.userId,'game_begin_push',game.button);
        //通知当前风向开始
        userMgr.sendMsg(s.userId,'game_feng_push',game.roomInfo.fengxiang);
    }

    //配合舟山补花逻辑 如果手牌里有花就先补花
    buhua(game,game.button);
    //
    var seatData = gameSeatsOfUsers[seats[1].userId];
    construct_game_base_info(game);
    userMgr.broacastInRoom('game_playing_push',null,seatData.userId,true);

    //进行听牌检查
    for(var i = 0; i < game.gameSeats.length; ++i){
        var duoyu = -1;
        var gs = game.gameSeats[i];
        if(gs.holds.length == 14){
            duoyu = gs.holds.pop();
            gs.countMap[duoyu] -= 1;
        }
        checkCanTingPai(game,gs);
        if(duoyu >= 0){
            gs.holds.push(duoyu);
            gs.countMap[duoyu] ++;
        }
    }



    var turnSeat = game.gameSeats[game.turn];
    game.state = "playing";
    //通知玩家出牌方
    turnSeat.canChuPai = true;
    userMgr.broacastInRoom('game_chupai_push',turnSeat.userId,turnSeat.userId,true);
    //检查是否可以暗杠或者胡
    //直杠
    checkCanAnGang(game,turnSeat);
    //检查胡 用最后一张来检查
    checkCanHu(game,turnSeat,turnSeat.holds[turnSeat.holds.length - 1]);
    //通知前端
    sendOperations(game,turnSeat,game.chuPai);
};

exports.huanSanZhang = function(userId,p1,p2,p3){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var game = seatData.game;
    if(game.state != "huanpai"){
        console.log("can't recv huansanzhang when game.state == " + game.state);
        return;
    }

    if(seatData.huanpais != null){
        console.log("player has done this action.");
        return;
    }

    if(seatData.countMap[p1] == null || seatData.countMap[p1] == 0){
        return;
    }
    seatData.countMap[p1]--;

    if(seatData.countMap[p2] == null || seatData.countMap[p2] == 0){
        seatData.countMap[p1]++;
        return;
    }
    seatData.countMap[p2]--;

    if(seatData.countMap[p3] == null || seatData.countMap[p3] == 0){
        seatData.countMap[p1]++;
        seatData.countMap[p2]++;
        return;
    }

    seatData.countMap[p1]++;
    seatData.countMap[p2]++;

    seatData.huanpais = [p1,p2,p3];

    for(var i = 0; i < seatData.huanpais.length; ++i){
        var p = seatData.huanpais[i];
        var idx = seatData.holds.indexOf(p);
        seatData.holds.splice(idx,1);
        seatData.countMap[p] --;
    }
    userMgr.sendMsg(seatData.userId,'game_holds_push',seatData.holds);

    for(var i = 0; i < game.gameSeats.length; ++i){
        var sd = game.gameSeats[i];
        if(sd == seatData){
            var rd = {
                si:seatData.userId,
                huanpais:seatData.huanpais
            };
            userMgr.sendMsg(sd.userId,'huanpai_notify',rd);
        }
        else{
            var rd = {
                si:seatData.userId,
                huanpais:[]
            };
            userMgr.sendMsg(sd.userId,'huanpai_notify',rd);
        }
    }

    //如果还有未换牌的玩家，则继承等待
    for(var i = 0; i < game.gameSeats.length; ++i){
        if(game.gameSeats[i].huanpais == null){
            return;
        }
    }


    //换牌函数
    var fn = function(s1,huanjin){
        for(var i = 0; i < huanjin.length; ++i){
            var p = huanjin[i];
            s1.holds.push(p);
            if(s1.countMap[p] == null){
                s1.countMap[p] = 0;
            }
            s1.countMap[p] ++;
        }
    }

    //开始换牌
    var f = Math.random();
    var s = game.gameSeats;
    var huanpaiMethod = 0;
    //对家换牌
    if(f < 0.33){
        fn(s[0],s[2].huanpais);
        fn(s[1],s[3].huanpais);
        fn(s[2],s[0].huanpais);
        fn(s[3],s[1].huanpais);
        huanpaiMethod = 0;
    }
    //换下家的牌
    else if(f < 0.66){
        fn(s[0],s[1].huanpais);
        fn(s[1],s[2].huanpais);
        fn(s[2],s[3].huanpais);
        fn(s[3],s[0].huanpais);
        huanpaiMethod = 1;
    }
    //换上家的牌
    else{
        fn(s[0],s[3].huanpais);
        fn(s[1],s[0].huanpais);
        fn(s[2],s[1].huanpais);
        fn(s[3],s[2].huanpais);
        huanpaiMethod = 2;
    }

    var rd = {
        method:huanpaiMethod,
    }
    game.huanpaiMethod = huanpaiMethod;

    game.state = "dingque";
    for(var i = 0; i < s.length; ++i){
        var userId = s[i].userId;
        userMgr.sendMsg(userId,'game_huanpai_over_push',rd);

        userMgr.sendMsg(userId,'game_holds_push',s[i].holds);
        //通知准备定缺
        userMgr.sendMsg(userId,'game_dingque_push');
    }
};

exports.chuPai = function(userId,pai){

    pai = Number.parseInt(pai);
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var game = seatData.game;
    var seatIndex = seatData.seatIndex;
    //如果不该他出，则忽略
    if(game.turn != seatData.seatIndex){
        console.log("not your turn.");
        return;
    }

    if(seatData.hued){
        console.log('you have already hued. no kidding plz.');
        return;
    }

    if(seatData.canChuPai == false){
        console.log('no need chupai.');
        return;
    }

    if(hasOperations(seatData)){
        console.log('plz guo before you chupai.');
        return;
    }

    //从此人牌中扣除
    var index = seatData.holds.indexOf(pai);
    if(index == -1){
        console.log("can't find mj." + pai);
        return;
    }

    seatData.canChuPai = false;
    game.chupaiCnt ++;
    seatData.guoHuFan = -1;

    seatData.holds.splice(index,1);
    seatData.countMap[pai] --;
    game.chuPai = pai;
    recordGameAction(game,seatData.seatIndex,ACTION_CHUPAI,pai);
    checkCanTingPai(game,seatData);

    userMgr.broacastInRoom('game_chupai_notify_push',{userId:seatData.userId,pai:pai},seatData.userId,true);

    //如果出的牌可以胡，则算过胡
    if(seatData.tingMap[game.chuPai]){
        seatData.guoHuFan = seatData.tingMap[game.chuPai].fan;
    }

    //检查是否有人要胡，要碰 要杠
    var hasActions = false;
    for(var i = 0; i < game.gameSeats.length; ++i){
        //玩家自己不检查
        if(game.turn == i){
            continue;
        }
        var ddd = game.gameSeats[i];
        //已经和牌的不再检查
        if(ddd.hued){
            continue;
        }

        checkCanHu(game,ddd,pai);
        if(seatData.lastFangGangSeat == -1){
            if(ddd.canHu && ddd.guoHuFan >= 0 && ddd.tingMap[pai].fan <= ddd.guoHuFan){
                console.log("ddd.guoHuFan:" + ddd.guoHuFan);
                ddd.canHu = false;
                userMgr.sendMsg(ddd.userId,'guohu_push');
            }
        }
        checkCanPeng(game,ddd,pai);
        checkCanDianGang(game,ddd,pai);
        checkCanChi(game,ddd,pai);
        if(hasOperations(ddd)){
            sendOperations(game,ddd,game.chuPai);
            hasActions = true;
        }
    }

    //如果没有人有操作，则向下一家发牌，并通知他出牌
    if(!hasActions){
        setTimeout(function(){
            userMgr.broacastInRoom('guo_notify_push',{userId:seatData.userId,pai:game.chuPai},seatData.userId,true);
            seatData.folds.push(game.chuPai);
            game.chuPai = -1;
            moveToNextUser(game);
            doUserMoPai(game);
        },500);
    }
};

exports.peng = function(userId){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var game = seatData.game;



    //如果是他出的牌，则忽略
    if(game.turn == seatData.seatIndex){
        console.log("it's your turn.");
        return;
    }



    //如果没有碰的机会，则不能再碰
    if(seatData.canPeng == false){
        console.log("seatData.peng == false");
        return;
    }

    //和的了，就不要再来了
    if(seatData.hued){
        console.log('you have already hued. no kidding plz.');
        return;
    }

    //如果有人可以胡牌，则需要等待
    var i = game.turn;
    while(true){
        var i = (i + 1)%4;
        if(i == game.turn){
            break;
        }
        else{
            var ddd = game.gameSeats[i];
            if(ddd.canHu && i != seatData.seatIndex){
                return;
            }
        }
    }


    clearAllOptions(game);

    //验证手上的牌的数目
    var pai = game.chuPai;
    var c = seatData.countMap[pai];
    if(c == null || c < 2){
        console.log("lack of mj.");
        return;
    }

    //进行碰牌处理
    //扣掉手上的牌
    //从此人牌中扣除
    for(var i = 0; i < 2; ++i){
        var index = seatData.holds.indexOf(pai);
        if(index == -1){
            console.log("can't find mj.");
            return;
        }
        seatData.holds.splice(index,1);
        seatData.countMap[pai] --;
    }
    seatData.pengs.push(pai);
    game.chuPai = -1;

    //记录三吃三碰
    seatData.sanchisanpeng[game.turn] ++;

    recordGameAction(game,seatData.seatIndex,ACTION_PENG,pai);

    //广播通知其它玩家
    userMgr.broacastInRoom('peng_notify_push',{userid:seatData.userId,pai:pai},seatData.userId,true);

    //碰的玩家打牌
    moveToNextUser(game,seatData.seatIndex);

    //广播通知玩家出牌方
    seatData.canChuPai = true;
    userMgr.broacastInRoom('game_chupai_push',seatData.userId,seatData.userId,true);

    //检查是否有人要胡，要碰 要杠s
    var hasActions = false;
    var ddd = seatData;
    //已经和牌的不再检查
    if(!ddd.hued){
        checkCanWanGang(game,ddd);
        if(hasOperations(ddd)){
            sendOperations(game,ddd,game.chuPai);
            hasActions = true;
        }
    }
    if(!hasActions) {
        //碰的玩家打牌
        moveToNextUser(game, seatData.seatIndex);
        //广播通知玩家出牌方
        seatData.canChuPai = true;
        userMgr.broacastInRoom('game_chupai_push', seatData.userId, seatData.userId, true);
        //配合舟山补花逻辑 如果手牌里有花就先补花
        buhua(game, seatData.seatIndex);
    }
};

exports.chi = function(userId,data){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var game = seatData.game;



    //如果是他出的牌，则忽略
    if(game.turn == seatData.seatIndex){
        console.log("it's your turn.");
        return;
    }



    //如果没有碰的机会，则不能再吃
    if(seatData.canChi == false){
        console.log("seatData.chi == false");
        return;
    }
    //和的了，就不要再来了
    if(seatData.hued){
        console.log('you have already hued. no kidding plz.');
        return;
    }
    //如果有人可以胡牌，碰或杠，则需要等待
    var i = game.turn;
    while(true){
        var i = (i + 1)%4;
        if(i == game.turn){
            break;
        }
        else{
            var ddd = game.gameSeats[i];
            if(ddd.canPeng && i != seatData.seatIndex){
                return;
            }
            if(ddd.canGang && i != seatData.seatIndex){
                return;
            }
            if(ddd.canHu && i != seatData.seatIndex){
                return;
            }
        }
    }



    clearAllOptions(game);

    //验证手上的牌的数目
    var pai = game.chuPai;
    //吃牌数组
    var chigroup = new Array(2);
    if(data == "left"){
        chigroup[0] = pai+1;
        chigroup[1] = pai+2;
    }else if(data == "mid"){
        chigroup[0] = pai-1;
        chigroup[1] = pai+1;
    }else if(data == "right"){
        chigroup[0] = pai-2;
        chigroup[1] = pai-1;
    }
    var holds = seatData.holds;
    var ifHas = function(holds,pai){
        for(var i=0; i<holds.length; i++){
            if(holds[i] == pai) return true;
        }
        return false;
    }
    if(!ifHas(holds,chigroup[0]) || !ifHas(holds,chigroup[1])){
        return;
    }


    //进行吃牌处理
    //扣掉手上的牌
    //从此人牌中扣除
    for(var i = 0; i < 2; ++i){
        var index = seatData.holds.indexOf(chigroup[i]);
        if(index == -1){
            console.log("can't find mj.");
            return;
        }
        seatData.holds.splice(index,1);
        seatData.countMap[chigroup[i]] --;
    }
    chigroup[2] = pai;
    seatData.chis.push(chigroup);
    game.chuPai = -1;

    //记录三吃三碰
    seatData.sanchisanpeng[game.turn] ++;

    recordGameAction(game,seatData.seatIndex,ACTION_CHI,pai,chigroup);
    //广播通知其它玩家
    userMgr.broacastInRoom('chi_notify_push',{userid:seatData.userId,pai:pai,chigroup:chigroup},seatData.userId,true);
    //检查是否有人要胡，要碰 要杠s
    var hasActions = false;
    var ddd = seatData;
    //已经和牌的不再检查
    if(!ddd.hued){
        checkCanWanGang(game,ddd);
        if(hasOperations(ddd)){
            sendOperations(game,ddd,game.chuPai);
            hasActions = true;
        }
    }
    if(!hasActions) {
        //吃的玩家打牌
        moveToNextUser(game, seatData.seatIndex);
        //广播通知玩家出牌方
        seatData.canChuPai = true;
        userMgr.broacastInRoom('game_chupai_push', seatData.userId, seatData.userId, true);
    }
};

exports.isPlaying = function(userId){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        return false;
    }

    var game = seatData.game;

    if(game.state == "idle"){
        return false;
    }
    return true;
};

exports.gang = function(userId,pai){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var seatIndex = seatData.seatIndex;
    var game = seatData.game;

    //如果没有杠的机会，则不能再杠
    if(seatData.canGang == false) {
        console.log("seatData.gang == false");
        return;
    }

    //和的了，就不要再来了
    if(seatData.hued){
        console.log('you have already hued. no kidding plz.');
        return;
    }

    if(seatData.gangPai.indexOf(pai) == -1){
        console.log("the given pai can't be ganged.");
        return;
    }

    //如果有人可以胡牌，则需要等待
    var i = game.turn;
    while(true){
        var i = (i + 1)%4;
        if(i == game.turn){
            break;
        }
        else{
            var ddd = game.gameSeats[i];
            if(ddd.canHu && i != seatData.seatIndex){
                return;
            }
        }
    }

    var numOfCnt = seatData.countMap[pai];

    var gangtype = ""
    //弯杠 去掉碰牌
    if(numOfCnt == 1){
        gangtype = "wangang"
    }
    else if(numOfCnt == 3){
        gangtype = "diangang"
    }
    else if(numOfCnt == 4){
        gangtype = "angang";
    }
    else{
        console.log("invalid pai count.");
        return;
    }

    game.chuPai = -1;
    clearAllOptions(game);
    seatData.canChuPai = false;

    userMgr.broacastInRoom('hangang_notify_push',seatIndex,seatData.userId,true);

    //如果是弯杠，则需要检查是否可以抢杠
    var turnSeat = game.gameSeats[game.turn];
    if(numOfCnt == 1){
        var canQiangGang = checkCanQiangGang(game,turnSeat,seatData,pai);
        if(canQiangGang){
            return;
        }
    }

    //记录三吃三碰
    seatData.sanchisanpeng[seatData.game.turn] ++;

    doGang(game,turnSeat,seatData,gangtype,numOfCnt,pai);
};

exports.hu = function(userId){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var seatIndex = seatData.seatIndex;
    var game = seatData.game;

    //如果他不能和牌，那和个啥啊
    if(seatData.canHu == false){
        console.log("invalid request.");
        return;
    }

    //和的了，就不要再来了
    if(seatData.hued){
        console.log('you have already hued. no kidding plz.');
        return;
    }

    //逆时针往前 如果有其他人可以胡，则不能胡
    var turn = game.turn;
    var si = (seatIndex+4-1)%4;
    while(si!=turn) {
        if(game.gameSeats[si].canHu){
            console.log('others can hu first');
            return;
        }
        si = (si+4-1)%4;
    }

    //标记为和牌
    seatData.hued = true;
    var hupai = game.chuPai;
    var isZimo = false;

    var turnSeat = game.gameSeats[game.turn];
    seatData.isGangHu = turnSeat.lastFangGangSeat >= 0;
    var notify = -1;

    if(game.qiangGangContext != null){
        var gangSeat = game.qiangGangContext.seatData;
        hupai = game.qiangGangContext.pai;
        notify = hupai;
        var ac = recordUserAction(game,seatData,"qiangganghu",gangSeat.seatIndex);
        ac.iszimo = true;
        recordGameAction(game,seatIndex,ACTION_HU,hupai);
        seatData.isQiangGangHu = true;
        game.qiangGangContext.isValid = false;


        var idx = gangSeat.holds.indexOf(hupai);
        if(idx != -1){
            gangSeat.holds.splice(idx,1);
            gangSeat.countMap[hupai]--;
            userMgr.sendMsg(gangSeat.userId,'game_holds_push',gangSeat.holds);
        }
        //将牌添加到玩家的手牌列表，供前端显示
        seatData.holds.push(hupai);
        if(seatData.countMap[hupai]){
            seatData.countMap[hupai]++;
        }
        else{
            seatData.countMap[hupai] = 1;
        }

        recordUserAction(game,gangSeat,"beiqianggang",seatIndex);
    }
    else if(game.chuPai == -1){
        hupai = seatData.holds[seatData.holds.length - 1];
        notify = -1;
        if(seatData.isGangHu){
            if(turnSeat.lastFangGangSeat == seatIndex){
                var ac = recordUserAction(game,seatData,"ganghua");
                ac.iszimo = true;
            }
            else{
                var diangganghua_zimo = game.conf.dianganghua == 1;
                if(diangganghua_zimo){
                    var ac = recordUserAction(game,seatData,"dianganghua");
                    ac.iszimo = true;
                }
                else{
                    var ac = recordUserAction(game,seatData,"dianganghua",turnSeat.lastFangGangSeat);
                    ac.iszimo = false;
                }
            }
        }
        else{
            var ac = recordUserAction(game,seatData,"zimo");
            ac.iszimo = true;
        }

        isZimo = true;
        recordGameAction(game,seatIndex,ACTION_ZIMO,hupai);
    }
    else{
        notify = game.chuPai;
        //将牌添加到玩家的手牌列表，供前端显示
        seatData.holds.push(game.chuPai);
        if(seatData.countMap[game.chuPai]){
            seatData.countMap[game.chuPai]++;
        }
        else{
            seatData.countMap[game.chuPai] = 1;
        }

        console.log(seatData.holds);

        var at = "hu";
        //炮胡
        if(turnSeat.lastFangGangSeat >= 0){
            at = "gangpaohu";
        }

        var ac = recordUserAction(game,seatData,at,game.turn);
        ac.iszimo = false;

        //毛转雨
        if(turnSeat.lastFangGangSeat >= 0){
            for(var i = turnSeat.actions.length-1; i >= 0; --i){
                var t = turnSeat.actions[i];
                if(t.type == "diangang" || t.type == "wangang" || t.type == "angang"){
                    t.state = "nop";
                    t.payTimes = 0;

                    var nac = {
                        type:"maozhuanyu",
                        owner:turnSeat,
                        ref:t
                    }
                    seatData.actions.push(nac);
                    break;
                }
            }
        }

        //记录玩家放炮信息
        var fs = game.gameSeats[game.turn];
        //记录点炮的玩家：
        game.fangpaoindex = game.turn;
        recordUserAction(game,fs,"fangpao",seatIndex);

        recordGameAction(game,seatIndex,ACTION_HU,hupai);

        game.fangpaoshumu++;

        if(game.fangpaoshumu > 1){
            game.yipaoduoxiang = seatIndex;
        }
    }

    if(game.firstHupai < 0){
        game.firstHupai = seatIndex;
    }

    //保存番数
    var ti = seatData.tingMap[hupai];
    seatData.fan = ti.fan;
    seatData.pattern = ti.pattern;
    seatData.iszimo = isZimo;
    //如果是最后一张牌，则认为是海底胡
    seatData.isHaiDiHu = game.currentIndex == game.mahjongs.length;
    game.hupaiList.push(seatData.seatIndex);

    if(game.conf.tiandihu){
        if(game.chupaiCnt == 0 && game.button == seatData.seatIndex && game.chuPai == -1){
            seatData.isTianHu = true;
        }
        else if(game.chupaiCnt == 1 && game.turn == game.button && game.button != seatData.seatIndex && game.chuPai != -1){
            seatData.isDiHu = true;
        }
    }

    clearAllOptions(game,seatData);

    //通知前端，有人和牌了
    userMgr.broacastInRoom('hu_push',{seatindex:seatIndex,iszimo:isZimo,hupai:notify},seatData.userId,true);

    //
    if(game.lastHuPaiSeat == -1){
        game.lastHuPaiSeat = seatIndex;
    }
    else{
        var lp = (game.lastFangGangSeat - game.turn + 4) % 4;
        var cur = (seatData.seatIndex - game.turn + 4) % 4;
        if(cur > lp){
            game.lastHuPaiSeat = seatData.seatIndex;
        }
    }

    //如果只有一家没有胡，则结束
    // var numOfHued = 0;
    // for(var i = 0; i < game.gameSeats.length; ++i){
    //     var ddd = game.gameSeats[i];
    //     if(ddd.hued){
    //         numOfHued ++;
    //     }
    // }
    // //和了三家
    // if(numOfHued == 3){
    doGameOver(game,seatData.userId);
    return;
    //}

    //清空所有非胡牌操作
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ddd = game.gameSeats[i];
        ddd.canPeng = false;
        ddd.canGang = false;
        ddd.canChuPai = false;
        sendOperations(game,ddd,hupai);
    }

    //如果还有人可以胡牌，则等待
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ddd = game.gameSeats[i];
        if(ddd.canHu){
            return;
        }
    }

    //和牌的下家继续打
    clearAllOptions(game);
    game.turn = game.lastHuPaiSeat;
    moveToNextUser(game);
    doUserMoPai(game);
};

exports.guo = function(userId){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var seatIndex = seatData.seatIndex;
    var game = seatData.game;

    //如果玩家没有对应的操作，则也认为是非法消息
    if((seatData.canGang || seatData.canPeng || seatData.canHu || seatData.canChi) == false){
        console.log("no need guo.");
        return;
    }

    //如果是玩家自己的轮子，不是接牌，则不需要额外操作
    var doNothing = game.chuPai == -1 && game.turn == seatIndex;

    userMgr.sendMsg(seatData.userId,"guo_result");
    clearAllOptions(game,seatData);

    //这里还要处理过胡的情况
    if(game.chuPai >= 0 && seatData.canHu){
        seatData.guoHuFan = seatData.tingMap[game.chuPai].fan;
    }

    if(doNothing){
        return;
    }

    //如果还有人可以操作，则等待
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ddd = game.gameSeats[i];
        if(hasOperations(ddd)){
            return;
        }
    }

    //如果是已打出的牌，则需要通知。
    if(game.chuPai >= 0){
        var uid = game.gameSeats[game.turn].userId;
        userMgr.broacastInRoom('guo_notify_push',{userId:uid,pai:game.chuPai},seatData.userId,true);
        seatData.folds.push(game.chuPai);
        game.chuPai = -1;
    }


    var qiangGangContext = game.qiangGangContext;
    //清除所有的操作
    clearAllOptions(game);

    if(qiangGangContext != null && qiangGangContext.isValid){
        doGang(game,qiangGangContext.turnSeat,qiangGangContext.seatData,"wangang",1,qiangGangContext.pai);
    }
    else{
        //下家摸牌
        moveToNextUser(game);
        doUserMoPai(game);
    }
};

exports.hasBegan = function(roomId){
    var game = games[roomId];
    if(game != null){
        return true;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo != null){
        return roomInfo.numOfGames > 0;
    }
    return false;
};

var dissolvingList = [];

exports.doDissolve = function(roomId){
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return null;
    }

    var game = games[roomId];
    doGameOver(game,roomInfo.seats[0].userId,true);
};

exports.dissolveRequest = function(roomId,userId){
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return null;
    }

    if(roomInfo.dr != null){
        return null;
    }

    var seatIndex = roomMgr.getUserSeat(userId);
    if(seatIndex == null){
        return null;
    }

    roomInfo.dr = {
        endTime:Date.now() + 30000,
        states:[false,false,false,false]
    };
    roomInfo.dr.states[seatIndex] = true;

    dissolvingList.push(roomId);

    return roomInfo;
};

exports.dissolveAgree = function(roomId,userId,agree){
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return null;
    }

    if(roomInfo.dr == null){
        return null;
    }

    var seatIndex = roomMgr.getUserSeat(userId);
    if(seatIndex == null){
        return null;
    }

    if(agree){
        roomInfo.dr.states[seatIndex] = true;
    }
    else{
        roomInfo.dr = null;
        var idx = dissolvingList.indexOf(roomId);
        if(idx != -1){
            dissolvingList.splice(idx,1);
        }
    }
    return roomInfo;
};

/***********************************************************************
 *
 *
 *
 * *************************************************************************/

function update() {
    for(var i = dissolvingList.length - 1; i >= 0; --i){
        var roomId = dissolvingList[i];

        var roomInfo = roomMgr.getRoom(roomId);
        if(roomInfo != null && roomInfo.dr != null){
            if(Date.now() > roomInfo.dr.endTime){
                console.log("delete room and games");
                exports.doDissolve(roomId);
                dissolvingList.splice(i,1);
            }
        }
        else{
            dissolvingList.splice(i,1);
        }
    }
}

setInterval(update,1000);

