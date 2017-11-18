var roomMgr = require("./roommgr");



//开始新的一局
exports.begin = function(roomId) {
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null) return;
    var seats = roomInfo.seats;
    var game = {
        conf:roomInfo.conf,
        roomInfo:roomInfo,
        gameIndex:roomInfo.numOfGames,
        button:roomInfo.nextButton,
        mahjongs:new Array(136),
        currentIndex:0,
        gameSeats:new Array(4),
        turn:roomInfo.nextButton,
        chuPai:-1,
        state:"idle",
        firstHupai:-1,
        yipaoduoxiang:-1,
        actionList:[],
        hupaiList:[],
        chupaiCnt:0,
        fangpaoindex:-1,
    };

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
        //是否刚刚杠过 (用于判断杠上花) 杠时会被重置为1，每次摸牌-1，如果胡的时候是0，则表示是杠上花
        data.ifJustGanged = -1;
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
        //是否可以出牌
        data.canChuPai = false;
        //记录所有坎子,如果胡牌了这里才会有
        data.kanzi = [];
        //如果guoHuFan >=0 表示处于过胡状态
        data.guoHuFan = -1;
        //是否胡了
        data.hued = false;
        //是否是自摸
        data.iszimo = false;
        data.isGangHu = false;
        data.actions = [];
        data.score = 0;
        //统计信息
        data.numZiMo = 0;
        data.numJiePao = 0;
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
