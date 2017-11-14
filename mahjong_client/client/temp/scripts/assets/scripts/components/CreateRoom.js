"use strict";
cc._RFpush(module, 'eec07HsL4pBn5/PiT3SYBew', 'CreateRoom');
// scripts\components\CreateRoom.js

cc.Class({
    "extends": cc.Component,

    properties: {
        _mahjongtype: null,
        _koufei: null,
        _quanshu: null,
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
            quanshu: quanshu
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: JSON.stringify(conf)
        };
        cc.vv.wc.show("正在创建房间");
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

        var self = this;
        var onCreate = function onCreate(ret) {
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
            quanshu: quanshu
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: JSON.stringify(conf)
        };
        cc.vv.wc.show("正在创建房间");
        cc.vv.http.sendRequest("/create_private_room", data, onCreate);
    }

});

cc._RFpop();