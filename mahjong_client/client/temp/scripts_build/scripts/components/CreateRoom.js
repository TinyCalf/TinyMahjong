"use strict";
cc._RFpush(module, 'eec07HsL4pBn5/PiT3SYBew', 'CreateRoom');
// scripts/components/CreateRoom.js

cc.Class({
    "extends": cc.Component,

    properties: {
        _mahjongtype: null,
        _koufei: null,
        _quanshu: null,
        _peizi: false,
        _qidui: false,
        _fengqing: false,
        _yitiaolong: false,
        _difen: null,
        _types: []
    },

    // use this for initialization
    onLoad: function onLoad() {
        //有多种玩法，跌倒胡 扬州麻将
        this._types = ["ddh", "yzmj"];

        //隐藏除第一种外的其他玩法 界面
        for (var i = 1; i < this._types.length; i++) {
            this.node.getChildByName(this._types[i]).active = false;
        }

        //读取开房历史
        var history = JSON.parse(cc.sys.localStorage.getItem("roomhistory"));
        if (!history) return;
        console.log(history);
        if (history.type == "yzmj") this.switchType("yzmj");
        var t = this.node.getChildByName(history.type);
        if (history.koufei == 0) {
            t.getChildByName("koufei").getChildByName("fangzhuchuzi").getComponent("RadioButton").check(true);
            t.getChildByName("koufei").getChildByName("wanjiapinfen").getComponent("RadioButton").check(false);
        } else {
            t.getChildByName("koufei").getChildByName("fangzhuchuzi").getComponent("RadioButton").check(false);
            t.getChildByName("koufei").getChildByName("wanjiapinfen").getComponent("RadioButton").check(true);
        }

        if (history.quanshu == 0) {
            t.getChildByName("quanshu").getChildByName("4ju").getComponent("RadioButton").check(true);
            t.getChildByName("quanshu").getChildByName("8ju").getComponent("RadioButton").check(false);
            t.getChildByName("quanshu").getChildByName("16ju").getComponent("RadioButton").check(false);
        } else if (history.quanshu == 1) {
            t.getChildByName("quanshu").getChildByName("4ju").getComponent("RadioButton").check(false);
            t.getChildByName("quanshu").getChildByName("8ju").getComponent("RadioButton").check(true);
            t.getChildByName("quanshu").getChildByName("16ju").getComponent("RadioButton").check(false);
        } else {
            t.getChildByName("quanshu").getChildByName("4ju").getComponent("RadioButton").check(false);
            t.getChildByName("quanshu").getChildByName("8ju").getComponent("RadioButton").check(false);
            t.getChildByName("quanshu").getChildByName("16ju").getComponent("RadioButton").check(true);
        }

        if (history.peizi == true) {
            t.getChildByName("wanfa").getChildByName("peizi").getComponent("CheckBox").check(true);
        }
        if (history.qidui == true) {
            t.getChildByName("wanfa").getChildByName("qidui").getComponent("CheckBox").check(true);
        }
        if (history.fengqing == true) {
            t.getChildByName("wanfa").getChildByName("fengqing").getComponent("CheckBox").check(true);
        }
        if (history.yitiaolong == true) {
            t.getChildByName("wanfa").getChildByName("yitiaolong").getComponent("CheckBox").check(true);
        }

        if (history.difen == 0) {
            t.getChildByName("difen").getChildByName("4ju").getComponent("RadioButton").check(true);
            t.getChildByName("difen").getChildByName("8ju").getComponent("RadioButton").check(false);
            t.getChildByName("difen").getChildByName("16ju").getComponent("RadioButton").check(false);
        } else if (history.difen == 1) {
            t.getChildByName("difen").getChildByName("4ju").getComponent("RadioButton").check(false);
            t.getChildByName("difen").getChildByName("8ju").getComponent("RadioButton").check(true);
            t.getChildByName("difen").getChildByName("16ju").getComponent("RadioButton").check(false);
        } else if (history.difen == 2) {
            t.getChildByName("difen").getChildByName("4ju").getComponent("RadioButton").check(false);
            t.getChildByName("difen").getChildByName("8ju").getComponent("RadioButton").check(false);
            t.getChildByName("difen").getChildByName("16ju").getComponent("RadioButton").check(true);
        }
    },

    onBtnBack: function onBtnBack() {
        this.node.active = false;
    },

    onBtnOK: function onBtnOK(event) {
        this.node.active = false;
        //确定游戏类型
        var type = event.target.parent.name;
        //分别进入不同的创建逻辑
        if (type == "ddh") {
            this.createRoomDDH();
        } else if (type == "yzmj") {
            this.createRoomYZMJ();
        }
    },

    onTypeClicked: function onTypeClicked(event) {
        console.log(event.target.parent.name);
        this.switchType(event.target.parent.name);
    },

    //tab界面切换
    switchType: function switchType(type) {
        for (var i = 0; i < this._types.length; i++) {
            this.node.getChildByName(this._types[i]).active = false;
        }
        this.node.getChildByName(type).active = true;
    },

    createRoomDDH: function createRoomDDH() {

        //获取需要的所有选项

        //这里一定要小写，后端会直接拼接这个字符串
        var type = "ddh";

        this._koufei = [];
        var t = this.node.getChildByName(type).getChildByName("koufei");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._koufei.push(n);
            }
        }

        this._quanshu = [];
        var t = this.node.getChildByName(type).getChildByName("quanshu");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._quanshu.push(n);
            }
        }

        var self = this;
        var onCreate = function onCreate(ret) {
            console.log("房间创建完成");
            console.log(ret);
            if (ret.errcode !== 0) {
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if (ret.errcode == 2222) {
                    cc.vv.alert.show("提示", "房卡不足，创建房间失败!");
                } else {
                    cc.vv.alert.show("提示", "创建房间失败,错误码:" + ret.errcode);
                }
            } else {
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var koufei = 0;
        for (var i = 0; i < self._koufei.length; ++i) {
            if (self._koufei[i].checked) {
                koufei = i;
                break;
            }
        }

        var quanshu = 0;
        for (var i = 0; i < self._quanshu.length; ++i) {
            if (self._quanshu[i].checked) {
                quanshu = i;
                break;
            }
        }

        var conf = {
            type: type,
            koufei: koufei,
            quanshu: quanshu,
            peizi: this.node.getChildByName(type).getChildByName("wanfa").getChildByName("peizi").getComponent("CheckBox").checked,
            qidui: this.node.getChildByName(type).getChildByName("wanfa").getChildByName("qidui").getComponent("CheckBox").checked,
            fengqing: this.node.getChildByName(type).getChildByName("wanfa").getChildByName("fengqing").getComponent("CheckBox").checked,
            yitiaolong: this.node.getChildByName(type).getChildByName("wanfa").getChildByName("yitiaolong").getComponent("CheckBox").checked
        };

        cc.sys.localStorage.setItem("roomhistory", JSON.stringify(conf));

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: JSON.stringify(conf)
        };
        cc.vv.wc.show("正在创建房间");
        console.log(conf);
        cc.vv.http.sendRequest("/create_private_room", data, onCreate);
    },

    createRoomYZMJ: function createRoomYZMJ() {

        //获取需要的所有选项

        //这里一定要小写，后端会直接拼接这个字符串
        var type = "yzmj";

        this._koufei = [];
        var t = this.node.getChildByName(type).getChildByName("koufei");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._koufei.push(n);
            }
        }

        this._quanshu = [];
        var t = this.node.getChildByName(type).getChildByName("quanshu");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._quanshu.push(n);
            }
        }

        this._difen = [];
        var t = this.node.getChildByName(type).getChildByName("difen");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._difen.push(n);
            }
        }

        var self = this;
        var onCreate = function onCreate(ret) {
            console.log("房间创建完成");
            console.log(ret);
            if (ret.errcode !== 0) {
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if (ret.errcode == 2222) {
                    cc.vv.alert.show("提示", "房卡不足，创建房间失败!");
                } else {
                    cc.vv.alert.show("提示", "创建房间失败,错误码:" + ret.errcode);
                }
            } else {
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var koufei = 0;
        for (var i = 0; i < self._koufei.length; ++i) {
            if (self._koufei[i].checked) {
                koufei = i;
                break;
            }
        }

        var quanshu = 0;
        for (var i = 0; i < self._quanshu.length; ++i) {
            if (self._quanshu[i].checked) {
                quanshu = i;
                break;
            }
        }

        var difen = 0;
        for (var i = 0; i < self._difen.length; ++i) {
            if (self._difen[i].checked) {
                difen = i;
                break;
            }
        }

        var conf = {
            type: type,
            koufei: koufei,
            quanshu: quanshu,
            difen: difen,
            peizi: this.node.getChildByName(type).getChildByName("wanfa").getChildByName("peizi").getComponent("CheckBox").checked,
            qidui: this.node.getChildByName(type).getChildByName("wanfa").getChildByName("qidui").getComponent("CheckBox").checked,
            fengqing: this.node.getChildByName(type).getChildByName("wanfa").getChildByName("fengqing").getComponent("CheckBox").checked,
            yitiaolong: this.node.getChildByName(type).getChildByName("wanfa").getChildByName("yitiaolong").getComponent("CheckBox").checked
        };

        cc.sys.localStorage.setItem("roomhistory", JSON.stringify(conf));

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: JSON.stringify(conf)
        };
        cc.vv.wc.show("正在创建房间");
        console.log(conf);
        cc.vv.http.sendRequest("/create_private_room", data, onCreate);
    },

    update: function update(dt) {
        var type = "ddh";
        var fangka = 1;

        var __koufei = [];
        var t = this.node.getChildByName(type).getChildByName("koufei");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                __koufei.push(n);
            }
        }
        var __quanshu = [];
        var t = this.node.getChildByName(type).getChildByName("quanshu");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                __quanshu.push(n);
            }
        }

        var quanshu = 0;
        for (var i = 0; i < __quanshu.length; ++i) {
            if (__quanshu[i].checked) {
                quanshu = i;
                break;
            }
        }

        var koufei = 0;
        for (var i = 0; i < __koufei.length; ++i) {
            if (__koufei[i].checked) {
                koufei = i;
                break;
            }
        }

        if (quanshu == 0 && koufei == 0) fangka = 3;
        if (quanshu == 1 && koufei == 0) fangka = 7;
        if (quanshu == 2 && koufei == 0) fangka = 15;

        if (quanshu == 0 && koufei == 1) fangka = 1;
        if (quanshu == 1 && koufei == 1) fangka = 2;
        if (quanshu == 2 && koufei == 1) fangka = 4;

        this.node.getChildByName(type).getChildByName("btn_ok").getChildByName("num").getComponent(cc.Label).string = "× " + fangka;

        var type = "yzmj";
        var fangka = 1;

        var __koufei = [];
        var t = this.node.getChildByName(type).getChildByName("koufei");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                __koufei.push(n);
            }
        }
        var __quanshu = [];
        var t = this.node.getChildByName(type).getChildByName("quanshu");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                __quanshu.push(n);
            }
        }

        var quanshu = 0;
        for (var i = 0; i < __quanshu.length; ++i) {
            if (__quanshu[i].checked) {
                quanshu = i;
                break;
            }
        }

        var koufei = 0;
        for (var i = 0; i < __koufei.length; ++i) {
            if (__koufei[i].checked) {
                koufei = i;
                break;
            }
        }

        if (quanshu == 0 && koufei == 0) fangka = 3;
        if (quanshu == 1 && koufei == 0) fangka = 7;
        if (quanshu == 2 && koufei == 0) fangka = 15;

        if (quanshu == 0 && koufei == 1) fangka = 1;
        if (quanshu == 1 && koufei == 1) fangka = 2;
        if (quanshu == 2 && koufei == 1) fangka = 4;

        this.node.getChildByName(type).getChildByName("btn_ok").getChildByName("num").getComponent(cc.Label).string = "× " + fangka;
    }
});

cc._RFpop();