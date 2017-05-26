"use strict";
cc._RFpush(module, '6edb3jjx+FBepS1mk1xKDF2', 'Hall');
// scripts\components\Hall.js

var Net = require("Net");
var Global = require("Global");
cc.Class({
    "extends": cc.Component,

    properties: {
        lblName: cc.Label,
        lblMoney: cc.Label,
        lblGems: cc.Label,
        lblID: cc.Label,
        lblNotice: cc.Label,
        joinGameWin: cc.Node,
        createRoomWin: cc.Node,
        settingsWin: cc.Node,
        helpWin: cc.Node,
        xiaoxiWin: cc.Node,
        btnJoinGame: cc.Node,
        btnReturnGame: cc.Node,
        sprHeadImg: cc.Sprite
    },

    // foo: {
    //    default: null,
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
    initNetHandlers: function initNetHandlers() {
        var self = this;
    },

    onShare: function onShare() {
        cc.vv.anysdkMgr.share("舟山麻将", "舟山麻将，包含了沈家门麻将、定海麻将、推到胡等多种舟山流行麻将玩法。");
    },

    onTimeline: function onTimeline() {
        cc.vv.anysdkMgr.shareOnTimeline("舟山麻将", "舟山麻将，包含了沈家门麻将、定海麻将、推到胡等多种舟山流行麻将玩法。");
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if (!cc.vv) {
            cc.director.loadScene("loading");
            return;
        }
        this.initLabels();

        if (cc.vv.gameNetMgr.roomId == null) {
            this.btnJoinGame.active = true;
            this.btnReturnGame.active = false;
        } else {
            this.btnJoinGame.active = false;
            this.btnReturnGame.active = true;
        }

        //var params = cc.vv.args;
        var roomId = cc.vv.userMgr.oldRoomId;
        if (roomId != null) {
            cc.vv.userMgr.oldRoomId = null;
            cc.vv.userMgr.enterRoom(roomId);
        }

        var imgLoader = this.sprHeadImg.node.getComponent("ImageLoader");
        imgLoader.setUserID(cc.vv.userMgr.userId);
        cc.vv.utils.addClickEvent(this.sprHeadImg.node, this.node, "Hall", "onBtnClicked");

        this.addComponent("UserInfoShow");

        this.initButtonHandler("Canvas/right_bottom/btn_shezhi");
        this.initButtonHandler("Canvas/right_bottom/btn_help");
        this.initButtonHandler("Canvas/right_bottom/btn_xiaoxi");
        this.helpWin.addComponent("OnBack");
        this.xiaoxiWin.addComponent("OnBack");

        if (!cc.vv.userMgr.notice) {
            cc.vv.userMgr.notice = {
                version: null,
                msg: "数据请求中..."
            };
        }

        if (!cc.vv.userMgr.gemstip) {
            cc.vv.userMgr.gemstip = {
                version: null,
                msg: "数据请求中..."
            };
        }

        this.lblNotice.string = cc.vv.userMgr.notice.msg;

        this.refreshInfo();
        this.refreshNotice();
        this.refreshGemsTip();

        cc.vv.audioMgr.playBGM("bgMain.mp3");

        //初始化签到信息
        this.initCheckin();

        //预加载麻将游戏界面
        cc.director.preloadScene('mjgame', function () {
            cc.log('preload mjgame complete!!!');
        });

        var youkeorweixin = cc.sys.localStorage.getItem("youkeorweixin");
        if (cc.sys.os == cc.sys.OS_IOS && youkeorweixin == "0") {
            //隐藏显示下边按钮
            cc.find("Canvas/hallBg/fujianmajiang").active = false;
            cc.find("Canvas/hallBg/anhuimajiang").active = false;
            cc.find("Canvas/hallBg/qiqibuyu").active = false;
            cc.find("Canvas/hallBg/qiqipuke").active = false;
            cc.find("Canvas/hallBg/more").active = false;
            cc.find("Canvas/hallBg/xixia001").active = false;
            cc.find("Canvas/top_left/headinfo/bg").active = false;
            cc.find("Canvas/top_left/headinfo/gems").active = false;
            cc.find("Canvas/top_left/headinfo/btn_add_gems").active = false;
            cc.find("Canvas/top_left/headinfo/lblGems").active = false;
            cc.find("Canvas/right_bottom/btn_zhanji").active = false;
            cc.find("Canvas/right_bottom/btn_share").active = false;
        }

        if (cc.vv.utils.showAct) {
            cc.find("Canvas/Activity").active = true;
        }
    },

    //初始化签到信息
    initCheckin: function initCheckin() {
        //获取签到信息
        var data = {
            userid: cc.vv.userMgr.userId
        };
        cc.vv.http.sendRequest("/get_checkin_status", data, function (res) {
            //当前已签到次数
            var checkin_days = res.errcode.data.checkin_days;
            //上次签到时间
            var checkin_date = res.errcode.data.checkin_data;
            //当前日期
            var d = new Date();
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            var day = d.getDate();
            day = day < 10 ? "0" + day : day;
            var nowdate = y + "-" + m + "-" + day;

            //获取7天的签到图片
            var days = cc.find("Canvas/CheckinBox/bg").children;
            var checkin_days = checkin_days % 7;
            for (var i = 0; i < checkin_days; i++) {
                days[i].getChildByName("hascheckin").active = true;
                days[i].getComponent(cc.Button).interactable = false;
                days[i].color = new cc.Color(168, 168, 168);
                days[i].opacity = 255;
            }
            for (var i = checkin_days; i < 7; i++) {
                days[i].getChildByName("hascheckin").active = false;
                days[i].getComponent(cc.Button).interactable = false;
                days[i].color = new cc.Color(255, 255, 255);
                days[i].opacity = 160;
            }
            if (checkin_date != nowdate) {
                days[checkin_days].opacity = 255;
                days[checkin_days].getComponent(cc.Button).interactable = true;
            }
        });
    },

    openShareBox: function openShareBox() {
        cc.find("Canvas/ShareBox").active = true;
    },

    closeShareBox: function closeShareBox() {
        cc.find("Canvas/ShareBox").active = false;
    },

    closeActivity: function closeActivity() {
        cc.find("Canvas/Activity").active = false;
        cc.vv.utils.showAct = false;
    },

    onDaysClicked: function onDaysClicked() {
        console.log("onDaysClicked");
        //隐藏签到面板
        cc.find("Canvas/CheckinBox").active = false;
        //发送请求
        var data = {
            userid: cc.vv.userMgr.userId
        };
        var self = this;
        cc.vv.http.sendRequest("/checkin", data, function (res) {
            var addgems = res.errcode.data.gems;
            self.initCheckin();
            cc.vv.alert.show("提示", "签到成功，获得" + addgems + "钻");
            cc.vv.userMgr.gems += addgems;
            cc.find("Canvas/top_left/headinfo/lblGems").getComponent(cc.Label).string = cc.vv.userMgr.gems;
        });
    },

    refreshInfo: function refreshInfo() {
        var self = this;
        var onGet = function onGet(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                if (ret.gems != null) {
                    this.lblGems.string = ret.gems;
                }
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign
        };
        cc.vv.http.sendRequest("/get_user_status", data, onGet.bind(this));
    },

    refreshGemsTip: function refreshGemsTip() {
        var self = this;
        var onGet = function onGet(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                cc.vv.userMgr.gemstip.version = ret.version;
                cc.vv.userMgr.gemstip.msg = ret.msg.replace("<newline>", "\n");
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            type: "fkgm",
            version: cc.vv.userMgr.gemstip.version
        };
        cc.vv.http.sendRequest("/get_message", data, onGet.bind(this));
    },

    refreshNotice: function refreshNotice() {
        var self = this;
        var onGet = function onGet(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                cc.vv.userMgr.notice.version = ret.version;
                cc.vv.userMgr.notice.msg = ret.msg;
                this.lblNotice.string = ret.msg;
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            type: "notice",
            version: cc.vv.userMgr.notice.version
        };
        cc.vv.http.sendRequest("/get_message", data, onGet.bind(this));
    },

    initButtonHandler: function initButtonHandler(btnPath) {
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn, this.node, "Hall", "onBtnClicked");
    },

    initLabels: function initLabels() {
        this.lblName.string = cc.vv.userMgr.userName;
        this.lblMoney.string = cc.vv.userMgr.coins;
        this.lblGems.string = cc.vv.userMgr.gems;
        this.lblID.string = "ID:" + cc.vv.userMgr.userId;
    },

    onBtnClicked: function onBtnClicked(event) {
        if (event.target.name == "btn_shezhi") {
            this.settingsWin.active = true;
        } else if (event.target.name == "btn_help") {
            this.helpWin.active = true;
        } else if (event.target.name == "btn_xiaoxi") {
            this.xiaoxiWin.active = true;
        } else if (event.target.name == "head") {
            cc.vv.userinfoShow.show(cc.vv.userMgr.userName, cc.vv.userMgr.userId, this.sprHeadImg, cc.vv.userMgr.sex, cc.vv.userMgr.ip);
        }
    },

    onJoinGameClicked: function onJoinGameClicked() {
        this.joinGameWin.active = true;
    },

    onReturnGameClicked: function onReturnGameClicked() {
        var loadgame = function loadgame() {
            cc.director.loadScene("mjgame");
        };
        var fadeout = cc.fadeOut(0.1);
        var finish = cc.callFunc(loadgame, this);
        var seq = cc.sequence(fadeout, finish);
        this.node.runAction(seq);
    },

    onBtnAddGemsClicked: function onBtnAddGemsClicked() {
        cc.vv.alert.show("提示", cc.vv.userMgr.gemstip.msg);
        this.refreshInfo();
    },

    onCreateRoomClicked: function onCreateRoomClicked() {
        if (cc.vv.gameNetMgr.roomId != null) {
            cc.vv.alert.show("提示", "房间已经创建!\n必须解散当前房间才能创建新的房间");
            return;
        }
        console.log("onCreateRoomClicked");
        this.createRoomWin.active = true;
    },

    onCheckinClicked: function onCheckinClicked() {
        cc.find("Canvas/CheckinBox").active = true;
    },
    onCheckinClose: function onCheckinClose() {
        cc.find("Canvas/CheckinBox").active = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        var x = this.lblNotice.node.x;
        x -= dt * 100;
        if (x + this.lblNotice.node.width < -1000) {
            x = 500;
        }
        this.lblNotice.node.x = x;

        if (cc.vv && cc.vv.userMgr.roomData != null) {
            cc.vv.userMgr.enterRoom(cc.vv.userMgr.roomData);
            cc.vv.userMgr.roomData = null;
        }
    }
});

cc._RFpop();