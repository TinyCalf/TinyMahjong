cc.Class({
    extends: cc.Component,

    properties: {
        lblRoomNo:{
            default:null,
            type:cc.Label
        },
        _seats:[],
        _seats2:[],
        _timeLabel:null,
        _voiceMsgQueue:[],
        _lastPlayingSeat:null,
        _playingSeat:null,
        _lastPlayTime:null,
        _ifshowipwarning:true,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this.initView();
        this.initSeats();
        this.initEventHandlers();
        
        var youkeorweixin = cc.sys.localStorage.getItem("youkeorweixin");
        if(cc.sys.os == cc.sys.OS_IOS && youkeorweixin == "0"){
            //隐藏显示下边按钮
            cc.find("Canvas/prepare/btnWeichat").active = false;
        }
        //this.addComponent("Alert");
    },
    
    initView:function(){
        var prepare = this.node.getChildByName("prepare");
        var seats = prepare.getChildByName("seats");
        for(var i = 0; i < seats.children.length; ++i){
            this._seats.push(seats.children[i].getComponent("Seat"));
        }
        
        this.refreshBtns();
        
        this.lblRoomNo = cc.find("Canvas/infobar/shijian/Z_room_txt/New Label").getComponent(cc.Label);
        this._timeLabel = cc.find("Canvas/infobar/shijian/time").getComponent(cc.Label);
        
        //显示玩法
        cc.find("Canvas/infobar/wanfa").getComponent(cc.Label).string =  cc.vv.gameNetMgr.getWanfa();
        
        
        this.lblRoomNo.string = cc.vv.gameNetMgr.roomId;
        var gameChild = this.node.getChildByName("game");
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            var sideNode = gameChild.getChildByName(sides[i]);
            var seat = sideNode.getChildByName("seat");
            this._seats2.push(seat.getComponent("Seat"));
        }
        
        var btnWechat = cc.find("Canvas/prepare/btnWeichat");
        if(btnWechat){
            cc.vv.utils.addClickEvent(btnWechat,this.node,"MJRoom","onBtnWeichatClicked");
        }
        
        var btnCopy = cc.find("Canvas/prepare/btnCopy");
        if(btnCopy){
            cc.vv.utils.addClickEvent(btnCopy,this.node,"MJRoom","onBtnCopyClicked");
        }
        
        
        var titles = cc.find("Canvas/typeTitle");
        for(var i = 0; i < titles.children.length; ++i){
            titles.children[i].active = false;
        }
        
        if(cc.vv.gameNetMgr.conf){
            // var type = cc.vv.gameNetMgr.conf.type;
            // if(type == null || type == ""){
            //     type = "xzdd";
            // }
            // titles.getChildByName(type).active = true;   
        }
    },
    
    refreshBtns:function(){
        var prepare = this.node.getChildByName("prepare");
        var btnExit = prepare.getChildByName("btnExit");
        var btnDispress = prepare.getChildByName("btnDissolve");
        var btnWeichat = prepare.getChildByName("btnWeichat");
        var btnBack = prepare.getChildByName("btnBack");
        var isIdle = cc.vv.gameNetMgr.numOfGames == 0;
        console.log('isIdle'+isIdle);
        console.log(cc.vv.gameNetMgr.numOfGames);
        btnExit.active = !cc.vv.gameNetMgr.isOwner() && isIdle;
        btnDispress.active = cc.vv.gameNetMgr.isOwner() && isIdle;
        
        btnWeichat.active = isIdle;
        btnBack.active = isIdle;
    },
    
    ipWarning:function(){
        
        if(!this._ifshowipwarning) return;
        
        var seats = cc.vv.gameNetMgr.seats;
        var nowseat = cc.vv.gameNetMgr.seatIndex;
        if(!nowseat) return;
        var others = [];
        for(var i = 0 ; i < 4 ; i ++) {
            if(nowseat && i!=nowseat) {
                others.push([seats[i].name,seats[i].ip]);
            }
        }
        var warnames = [];
        if ( (others[0][1] == others [1][1] || others[0][1] == others [2][1]) && others[0][1]!=null) {
            warnames.push(others[0][0]);
        }
        if ( (others[1][1] == others [0][1] || others[1][1] == others [2][1]) && others[1][1]!=null) {
            warnames.push(others[1][0]);
        }
        if ( (others[2][1] == others [1][1] || others[2][1] == others [0][1]) && others[1][1]!=null) {
            warnames.push(others[2][0]);
        }
        var str = warnames.join("、");
        if(warnames.length > 0 ){
            cc.vv.alert.show("IP警告","玩家" + str + "来自相同IP，请谨防其他玩家打勾手上当受骗",function(){
                  cc.vv.net.send("dissolve_cause_ip");
            },true,"解散","继续");
            this._ifshowipwarning = false;
        }
        
    },
    
    initEventHandlers:function(){
        var self = this;
        this.node.on('new_user',function(data){
            self.initSingleSeat(data.detail);
        });
        
        this.node.on('user_state_changed',function(data){
            self.initSingleSeat(data.detail);
        });
        
        this.node.on('game_begin',function(data){
            
            self.refreshBtns();
            self.initSeats();
        });
        
        this.node.on('game_num',function(data){
            
            self.refreshBtns();
        });

        this.node.on('game_huanpai',function(data){
            for(var i in self._seats2){
                self._seats2[i].refreshXuanPaiState();    
            }
        });
                
        this.node.on('huanpai_notify',function(data){
            var idx = data.detail.seatindex;
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            self._seats2[localIdx].refreshXuanPaiState();
        });
        
        this.node.on('game_huanpai_over',function(data){
            for(var i in self._seats2){
                self._seats2[i].refreshXuanPaiState();    
            }
        });
        
        this.node.on('voice_msg',function(data){
            var data = data.detail;
            self._voiceMsgQueue.push(data);
            self.playVoice();
        });
        
        this.node.on('chat_push',function(data){
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            self._seats[localIdx].chat(data.content);
            self._seats2[localIdx].chat(data.content);
        });
        
        this.node.on('quick_chat_push',function(data){
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            
            var index = data.content;
            var info = cc.vv.chat.getQuickChatInfo(index);
            self._seats[localIdx].chat(info.content);
            self._seats2[localIdx].chat(info.content);
            
            cc.vv.audioMgr.playSFX(info.sound);
        });
        
        this.node.on('emoji_push',function(data){
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            console.log(data);
            self._seats[localIdx].emoji(data.content);
            self._seats2[localIdx].emoji(data.content);
        });
    },
    
    initSeats:function(){
        var seats = cc.vv.gameNetMgr.seats;
        for(var i = 0; i < seats.length; ++i){
            this.initSingleSeat(seats[i]);
        }
    },
    
    initSingleSeat:function(seat){
        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;
        var isZhuang = seat.seatindex == cc.vv.gameNetMgr.button;
        
        console.log("isOffline:" + isOffline);
        
        this._seats[index].setInfo(seat.name,seat.score);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);
        
        this._seats2[index].setInfo(seat.name,seat.score);
        this._seats2[index].setZhuang(isZhuang);
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].setID(seat.userid);
        this._seats2[index].voiceMsg(false);
        this._seats2[index].refreshXuanPaiState();
    },
    
    onBtnSettingsClicked:function(){
        cc.vv.popupMgr.showSettings();   
    },

    onBtnBackClicked:function(){
        cc.vv.alert.show("返回大厅","返回大厅房间仍会保留，快去邀请大伙来玩吧！",function(){
            cc.director.loadScene("hall");    
        },true);
    },
    
    onBtnChatClicked:function(){
        
    },
    
    onBtnWeichatClicked:function(){
        if(cc.vv.gameNetMgr.conf.type == "sjmmj"){
            var title = "<沈家门麻将>";
        }
        else if(cc.vv.gameNetMgr.conf.type == "dhmj"){
            var title = "<定海麻将>";
        }
        else if(cc.vv.gameNetMgr.conf.type == "tdh"){
            var title = "<推倒胡>";
        }
        cc.vv.anysdkMgr.share("奇奇舟山麻将" + title,"房号:" + cc.vv.gameNetMgr.roomId + " 玩法:" + cc.vv.gameNetMgr.getWanfa());
    },
    
    //复制房间信息
    onBtnCopyClicked:function() {
        if(cc.vv.gameNetMgr.conf.type == "sjmmj"){
            var title = "<沈家门麻将>";
        }
        else if(cc.vv.gameNetMgr.conf.type == "dhmj"){
            var title = "<定海麻将>";
        }
        else if(cc.vv.gameNetMgr.conf.type == "tdh"){
            var title = "<推倒胡>";
        }
        cc.vv.anysdkMgr.copy("奇奇舟山麻将" + title + " 房号:【" + cc.vv.gameNetMgr.roomId+"】 玩法:" + cc.vv.gameNetMgr.getWanfa());
        cc.find("Canvas/copysuccess").active = true;
        setTimeout(function() {cc.find("Canvas/copysuccess").active = false;}, 1000);
        
    },
    
    onBtnDissolveClicked:function(){
        var youkeorweixin = cc.sys.localStorage.getItem("youkeorweixin");
        if(cc.sys.os == cc.sys.OS_IOS && youkeorweixin == "0"){
            cc.vv.alert.show("解散房间","是否确定解散？",function(){
                cc.vv.net.send("dispress");    
            },true);
            return;
        }
        
        
        cc.vv.alert.show("解散房间","解散房间不扣房卡，是否确定解散？",function(){
            cc.vv.net.send("dispress");    
        },true);
    },
    
    onBtnExit:function(){
        cc.vv.net.send("exit");
    },
    
    playVoice:function(){
        if(this._playingSeat == null && this._voiceMsgQueue.length){
            console.log("playVoice2");
            var data = this._voiceMsgQueue.shift();
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(idx);
            this._playingSeat = localIndex;
            this._seats[localIndex].voiceMsg(true);
            this._seats2[localIndex].voiceMsg(true);
            
            var msgInfo = JSON.parse(data.content);
            
            var msgfile = "voicemsg.amr";
            console.log(msgInfo.msg.length);
            cc.vv.voiceMgr.writeVoice(msgfile,msgInfo.msg);
            cc.vv.voiceMgr.play(msgfile);
            this._lastPlayTime = Date.now() + msgInfo.time;
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var minutes = Math.floor(Date.now()/1000/60);
        if(this._lastMinute != minutes){
            this._lastMinute = minutes;
            var date = new Date();
            var h = date.getHours();
            h = h < 10? "0"+h:h;
            
            var m = date.getMinutes();
            m = m < 10? "0"+m:m;
            this._timeLabel.string = "" + h + ":" + m;             
        }
        
        
        if(this._lastPlayTime != null){
            if(Date.now() > this._lastPlayTime + 200){
                this.onPlayerOver();
                this._lastPlayTime = null;    
            }
        }
        else{
            this.playVoice();
        }
        this.ipWarning();
    },
    
        
    onPlayerOver:function(){
        cc.vv.audioMgr.resumeAll();
        console.log("onPlayCallback:" + this._playingSeat);
        var localIndex = this._playingSeat;
        this._playingSeat = null;
        this._seats[localIndex].voiceMsg(false);
        this._seats2[localIndex].voiceMsg(false);
    },
    
    onDestroy:function(){
        cc.vv.voiceMgr.stop();
//        cc.vv.voiceMgr.onPlayCallback = null;
    }
});
